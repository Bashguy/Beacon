import "react-native-get-random-values";
import { Linking, Keyboard, Modal } from "react-native";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Pressable,
  Platform,
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
  MapPressEvent,
} from "react-native-maps";
import * as Location from "expo-location";
import { db } from "../../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import Constants from "expo-constants";
import {
  GooglePlacesAutocomplete,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
import { MaterialIcons } from "@expo/vector-icons";
import * as Battery from "expo-battery";

// --- Type Definitions ---
type LatLng = { latitude: number; longitude: number };

type TripDoc = {
  start?: LatLng | null;
  dest?: LatLng | null;
  etaMinutes?: number | null;
  routePolyline?: LatLng[] | null;
  journeyActive?: boolean | null;
};

type SearchMode = "start" | "dest" | null;

// --- Constants ---
const TRIP_DOC = doc(db, "sessions", "current");

// --- Main Component ---
export default function MapScreen() {
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [trip, setTrip] = useState<TripDoc>({});
  const [searchMode, setSearchMode] = useState<SearchMode>(null);

  const start = trip.start ?? undefined;
  const dest = trip.dest ?? undefined;
  const hasBoth = !!(start && dest);
  const journeyActive = !!trip.journeyActive;

  // Firestore listener
  useEffect(() => {
    const unsub = onSnapshot(TRIP_DOC, (snap) => {
      const data = (snap.data() || {}) as TripDoc;
      setTrip({
        start: data.start ?? undefined,
        dest: data.dest ?? undefined,
        etaMinutes: data.etaMinutes ?? null,
        routePolyline: data.routePolyline ?? null,
        journeyActive: !!data.journeyActive,
      });
    });
    return () => unsub();
  }, []);

  // Initial user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setRegion({
          latitude: 28.6024,
          longitude: -81.2001,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        });
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      });
    })();
  }, []);

  // ETA + Route polyline calculation
  useEffect(() => {
    if (!hasBoth) return;
    let cancelled = false;

    (async () => {
      try {
        const key = Constants.expoConfig?.extra?.googleMapsKey as string;
        if (!key) {
          console.warn("Missing extra.googleMapsKey in app.json/app.config");
          return;
        }

        const [etaMinutes, routePolyline] = await Promise.all([
          getWalkingETA(start!, dest!, key),
          getWalkingRoutePolyline(start!, dest!, key),
        ]);

        if (!cancelled) {
          await setDoc(
            TRIP_DOC,
            { etaMinutes, routePolyline },
            { merge: true }
          );
        }
      } catch (e) {
        console.warn(e);
        if (!cancelled)
          Alert.alert("Route error", "Could not fetch route/ETA.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [start?.latitude, start?.longitude, dest?.latitude, dest?.longitude]);

  //batery stuff
  useEffect(() => {
    async function checkAvailability() {
      const isBatteryAvailable = await Battery.isAvailableAsync();
      setIsAvailable(isBatteryAvailable);
    }
    checkAvailability();
  }, []);

  const [isAvailable, setIsAvailable] = useState(false);

  // Tap to set points on map
  const handlePress = async (e: MapPressEvent) => {
    if (journeyActive) return; // Don't allow changing points during active journey
    Keyboard.dismiss();
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newPoint = { latitude, longitude };
    if (!start) {
      await setDoc(
        TRIP_DOC,
        { start: newPoint, etaMinutes: null, routePolyline: null },
        { merge: true }
      );
    } else {
      await setDoc(
        TRIP_DOC,
        { dest: newPoint, etaMinutes: null, routePolyline: null },
        { merge: true }
      );
    }
  };

  // --- Actions ---
  const resetTrip = async () => {
    await setDoc(
      TRIP_DOC,
      {
        start: null,
        dest: null,
        etaMinutes: null,
        routePolyline: null,
        journeyActive: false,
      },
      { merge: true }
    );
  };

  const beginJourney = useCallback(async () => {
  if (!hasBoth) return;

  // Mark journey as started in Firestore
  setTrip((t) => ({ ...t, began: true }));

  try {
    // Make backend call to notify contacts
    const res = await fetch("http://<your-server>/notify-start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "sameer123", // TODO: replace with logged-in user’s ID
        destination: trip.dest ? `${trip.dest.latitude},${trip.dest.longitude}` : "Unknown",
        eta: trip.etaMinutes ? `${trip.etaMinutes} minutes` : "Unknown",
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Failed to notify contacts:", data.error);
    }
  } catch (err) {
    console.error("Error notifying contacts:", err);
  }
}, [hasBoth, setTrip, trip]);


  const endJourney = async () => {
    await setDoc(TRIP_DOC, { journeyActive: false }, { merge: true });
  };

  const sendBeacon = () => {
    const msg = encodeURIComponent(
      `I'm walking via Beacon. Start: ${start?.latitude?.toFixed(
        4
      )},${start?.longitude?.toFixed(4)} → Dest: ${dest?.latitude?.toFixed(
        4
      )},${dest?.longitude?.toFixed(4)}`
    );
    Linking.openURL(`sms:&body=${msg}`).catch(() =>
      Alert.alert("Could not open Messages")
    );
  };

  const placesKey = Constants.expoConfig?.extra?.googleMapsKey as string;

  const placeholderText =
    searchMode === "start" ? "Search starting point" : "Search destination";

  if (!region) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#F5F1E9" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainCard}>
        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={StyleSheet.absoluteFill}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            showsUserLocation
            showsMyLocationButton
            onPress={handlePress}
          >
            {start && <Marker coordinate={start} title="Start" />}
            {dest && <Marker coordinate={dest} title="Destination" />}
            {trip.routePolyline?.length ? (
              <Polyline
                coordinates={trip.routePolyline}
                strokeWidth={6}
                strokeColor="#2A7F6F"
                lineCap="round"
                lineJoin="round"
              />
            ) : null}
          </MapView>

          {/* Floating round buttons (Reset / SOS) */}
          <View pointerEvents="box-none" style={styles.fabCol}>
            <Pressable style={styles.fab} onPress={resetTrip}>
              <MaterialIcons name="refresh" size={22} color="#fff" />
            </Pressable>
            <Pressable
              style={[styles.fab, styles.fabDanger]}
              onPress={() => callEmergency()}
            >
              <MaterialIcons name="sos" size={22} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Bottom controls */}
        {!journeyActive ? (
          <View style={styles.controlsStack}>
            <Pressable
              style={styles.fakeInput}
              onPress={() => setSearchMode("start")}
            >
              <Text style={styles.fakeInputText} numberOfLines={1}>
                {start
                  ? `Start: ${start.latitude.toFixed(
                      4
                    )}, ${start.longitude.toFixed(4)}`
                  : "Starting Location"}
              </Text>
            </Pressable>
            <Pressable
              style={styles.fakeInput}
              onPress={() => setSearchMode("dest")}
            >
              <Text style={styles.fakeInputText} numberOfLines={1}>
                {dest
                  ? `Destination: ${dest.latitude.toFixed(
                      4
                    )}, ${dest.longitude.toFixed(4)}`
                  : "Destination"}
              </Text>
            </Pressable>
            <Pressable
              disabled={!hasBoth}
              style={[styles.primaryBtn, !hasBoth && styles.btnDisabled]}
              onPress={beginJourney}
            >
              <Text style={styles.primaryBtnText}>
                {`Begin Journey${
                  typeof trip.etaMinutes === "number"
                    ? ` • ${trip.etaMinutes} min`
                    : ""
                }`}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.controlsStack}>
            <Pressable style={styles.primaryBtn} onPress={endJourney}>
              <Text style={styles.primaryBtnText}>End Journey</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={sendBeacon}>
              <Text style={styles.primaryBtnText}>Send Beacon</Text>
            </Pressable>
          </View>
        )}

        {/* Full-screen translucent search overlay */}
        <Modal
          visible={!!searchMode}
          animationType="fade"
          transparent
          onRequestClose={() => setSearchMode(null)}
        >
          <View style={styles.overlay}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setSearchMode(null)}
            />
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>
                {searchMode === "start"
                  ? "Choose starting point"
                  : "Choose destination"}
              </Text>
              {placesKey ? (
                <GooglePlacesAutocomplete
                  key={searchMode} // ok to force remount when switching start/dest
                  placeholder={placeholderText}
                  fetchDetails
                  debounce={120}
                  enablePoweredByContainer={false}
                  // ✅ Safeguards: make sure arrays are actually arrays
                  predefinedPlaces={[]} // older versions blow up if this is undefined
                  predefinedPlacesAlwaysVisible={false}
                  // If your version supports it, keep; if TS yells, remove:
                  // listViewProps={{ keyboardShouldPersistTaps: "handled" }}

                  minLength={2}
                  query={{ key: placesKey, language: "en" }}
                  onFail={(err) => console.warn("Places error:", err)}
                  onNotFound={() => {
                    /* no-op, but prevents some versions from touching undefined lists */
                  }}
                  onPress={async (_data, details) => {
                    const loc = details?.geometry?.location;
                    if (!loc) return;
                    const newPoint: LatLng = {
                      latitude: loc.lat,
                      longitude: loc.lng,
                    };
                    await setDoc(
                      TRIP_DOC,
                      searchMode === "start"
                        ? {
                            start: newPoint,
                            etaMinutes: null,
                            routePolyline: null,
                          }
                        : {
                            dest: newPoint,
                            etaMinutes: null,
                            routePolyline: null,
                          },
                      { merge: true }
                    );
                    setSearchMode(null);
                    Keyboard.dismiss();
                  }}
                  textInputProps={{
                    autoFocus: true,
                    placeholder: placeholderText,
                    placeholderTextColor: "#A9A9A9",
                    returnKeyType: "done",
                    onSubmitEditing: () => Keyboard.dismiss(),
                  }}
                  styles={{
                    container: { flex: 1 },
                    textInputContainer: { paddingHorizontal: 0 },
                    textInput: styles.overlayInput,
                    listView: styles.overlayList,
                    row: styles.row,
                    separator: styles.separator,
                    description: styles.rowText,
                  }}
                />
              ) : (
                <Text style={styles.keyWarning}>
                  Missing Google Places key (extra.googleMapsKey).
                </Text>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

// --- Helper Functions ---

async function getWalkingETA(
  start: LatLng,
  dest: LatLng,
  key: string
): Promise<number> {
  const url =
    "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix";
  const body = {
    origins: [{ waypoint: { location: { latLng: start } } }],
    destinations: [{ waypoint: { location: { latLng: dest } } }],
    travelMode: "WALK",
    units: "IMPERIAL",
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "duration,status",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Routes API HTTP ${res.status}: ${text}`);
  const data = JSON.parse(text);
  const el = data?.[0];
  if (!el || !el.duration) {
    throw new Error(`${el?.status?.message || "Could not calculate ETA."}`);
  }
  const seconds =
    typeof el.duration === "string"
      ? parseFloat(el.duration.replace("s", ""))
      : Number(el.duration?.seconds);
  if (!Number.isFinite(seconds)) throw new Error("Invalid ETA seconds");
  return Math.round(seconds / 60);
}

async function getWalkingRoutePolyline(
  start: LatLng,
  dest: LatLng,
  key: string
): Promise<LatLng[]> {
  const url = "https://routes.googleapis.com/directions/v2:computeRoutes";
  const body = {
    origin: { location: { latLng: start } },
    destination: { location: { latLng: dest } },
    travelMode: "WALK",
    polylineQuality: "HIGH_QUALITY",
    polylineEncoding: "GEO_JSON_LINESTRING",
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "routes.polyline.geoJsonLinestring",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Directions API HTTP ${res.status}: ${text}`);
  const data = JSON.parse(text);
  const coords =
    data?.routes?.[0]?.polyline?.geoJsonLinestring?.coordinates ?? null;
  if (!coords?.length) throw new Error("Directions API: no polyline");
  return coords.map(([lng, lat]: [number, number]) => ({
    latitude: lat,
    longitude: lng,
  }));
}

function callEmergency(number = "911") {
  const url = `tel:${number}`;
  Linking.canOpenURL(url)
    .then((supported) =>
      supported ? Linking.openURL(url) : Alert.alert("Phone call not supported")
    )
    .catch((err) => console.error("Error opening dialer", err));
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2A332A",
    alignItems: "center",
    justifyContent: "center",
  },
  mainCard: {
    width: "95%",
    height: "90%",
    backgroundColor: "#F5F1E9",
    borderRadius: 24,
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  mapContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#EAE6DA",
  },
  controlsStack: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    gap: 10,
    zIndex: 20,
  },
  fakeInput: {
    backgroundColor: "#FFFFFF",
    height: 48,
    borderColor: "#00000020",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  fakeInputText: { color: "#666", fontSize: 16 },
  primaryBtn: {
    backgroundColor: "#2A332A",
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#F5F1E9", fontSize: 18, fontWeight: "700" },
  btnDisabled: { opacity: 0.5 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: "90%",
    backgroundColor: "#F5F1E9",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2A332A",
    marginBottom: 8,
  },
  overlayInput: {
    backgroundColor: "#FFFFFF",
    height: 50,
    borderColor: "#00000020",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
  },
  overlayList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderColor: "#00000020",
    borderWidth: 1,
  },
  row: { paddingVertical: 10, paddingHorizontal: 12 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: "#00000020" },
  rowText: { color: "#222" },
  fabCol: {
    position: "absolute",
    right: 12,
    top: 12,
    gap: 10,
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2A332A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  fabDanger: { backgroundColor: "#D92D20" },
  keyWarning: {
    backgroundColor: "#FDECEC",
    color: "#8B3A3A",
    padding: 10,
    borderRadius: 10,
    fontWeight: "700",
  },
});
