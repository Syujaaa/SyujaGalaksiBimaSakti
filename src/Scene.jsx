import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, Suspense, useEffect } from "react";
import { OrbitControls, Trail, Text, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { gsap } from "gsap";
import * as THREE from "three";
import Planet from "./planet";
import Sun from "./sun";
import Particles from "./particles";
import Asteroids from "./asteroids";
import PlanetPositions from "./planetPositions";
import PlanetFacts from "./planetFacts";
import Background from "./background";

export default function Scene() {
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const planetNames = Object.keys(PlanetFacts);
  const [mainCamera, setMainCamera] = useState(null);
  const initialCameraPosition = new THREE.Vector3(-50, 10, -15);

  const controlsRef = useRef();

  const navigatePlanet = (direction) => {
    const planets = Object.keys(PlanetFacts);
    const currentIndex = planets.indexOf(selectedPlanet);
    const newIndex =
      (currentIndex + direction + planets.length) % planets.length;
    handlePlanetClick(planets[newIndex]);
  };

  const focusOnPlanet = (planetName) => {
    if (!mainCamera) return;

    const targetPosition = PlanetPositions[planetName];

    const offsetDirection = targetPosition
      .clone()
      .normalize()
      .multiplyScalar(5);
    const focusPosition = targetPosition.clone().add(offsetDirection);

    mainCamera.position.set(focusPosition.x, focusPosition.y, focusPosition.z);
    mainCamera.lookAt(targetPosition.x, targetPosition.y, targetPosition.z);

    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
  };

  // const handlePlanetClick = (planetName) => {
  //     if (selectedPlanet === planetName) {
  //         setSelectedPlanet(null);
  //         camera.position.lerp(initialCameraPosition, 0.1);
  //         camera.lookAt(new THREE.Vector3(0, 0, 0));
  //     } else {
  //         setSelectedPlanet(planetName);
  //     }
  // };

  const listContainerRef = useRef(null);
  const selectedItemRef = useRef(null);

  useEffect(() => {
    if (selectedItemRef.current && listContainerRef.current) {
      const container = listContainerRef.current;
      const selectedItem = selectedItemRef.current;

      const containerHeight = container.clientHeight;
      const itemOffset = selectedItem.offsetTop;
      const itemHeight = selectedItem.clientHeight;

      container.scrollTo({
        top: itemOffset - containerHeight / 2 + itemHeight / 2,
        behavior: "smooth",
      });
    }
  }, [selectedPlanet]);

  const handlePlanetClick = (planetName) => {
    if (selectedPlanet === planetName) {
      setSelectedPlanet(null);

      if (mainCamera) {
        gsap.to(mainCamera.position, {
          x: initialCameraPosition.x,
          y: initialCameraPosition.y,
          z: initialCameraPosition.z,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            mainCamera.lookAt(0, 0, 0);
          },
          onComplete: () => {
            if (controlsRef.current) {
              controlsRef.current.enabled = true;
            }
          },
        });
      }
      return;
    }

    setSelectedPlanet(planetName);
    focusOnPlanet(planetName);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          color: "white",
          zIndex: 100,
        }}
      >
        <label>Kecepatan Orbit: </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={speedMultiplier}
          onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: isMobile ? "2.0rem" : "0.5",
          right: isMobile ? "0.5rem" : "1rem",
          color: "#f0f0f0",
          zIndex: 100,
          textAlign: "center",
          fontSize: isMobile ? "0.65rem" : "0.9rem",
          background: "rgba(20, 20, 20, 0.95)",
          padding: isMobile ? "0.3rem 0.2rem" : "1rem",
          borderRadius: "6px",
          width: isMobile ? "100px" : "180px",
          maxWidth: isMobile ? "28vw" : "180px",
          overflow: "hidden",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          marginTop: "0.5rem",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <h3
          style={{
            fontSize: isMobile ? "0.75rem" : "1.1rem",
            marginBottom: isMobile ? "0.3rem" : "0.8rem",
            color: "#ffffff",
            fontWeight: "500",
            letterSpacing: "0.2px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            padding: isMobile ? "0 0.2rem" : "0",
          }}
        >
          Daftar Planet
        </h3>

        <div
          ref={listContainerRef}
          style={{
            maxHeight: isMobile ? "150px" : "300px",
            overflowY: "auto",
            paddingRight: "2px",
            marginBottom: isMobile ? "0.3rem" : "0.8rem",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.2) transparent",
          }}
        >
          {planetNames.map((planet) => (
            <div
              key={planet}
              ref={selectedPlanet === planet ? selectedItemRef : null}
              style={{
                cursor: "pointer",
                padding: isMobile ? "4px 2px" : "8px 5px",
                background:
                  selectedPlanet === planet
                    ? "rgba(255, 255, 255, 0.15)"
                    : "transparent",
                fontSize: isMobile ? "0.65rem" : "0.85rem",
                borderRadius: "3px",
                textAlign: "center",
                margin: "1px 0",
                transition: "all 0.2s ease",
                border:
                  selectedPlanet === planet
                    ? "1px solid rgba(255, 255, 255, 0.3)"
                    : "1px solid transparent",
                color:
                  selectedPlanet === planet
                    ? "#fff"
                    : "rgba(255, 255, 255, 0.8)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                ":hover": {
                  background: "rgba(255, 255, 255, 0.1)",
                },
              }}
              onClick={() => handlePlanetClick(planet)}
            >
              {planet}
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: "0.55rem",
            color: "rgba(255, 255, 255, 0.6)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "0.2rem",
            marginTop: "0.2rem",
            lineHeight: "1.2",
          }}
        >
          Created by{" "}
          <a
            href="https://portfoliofarrassyuja.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "rgba(100, 200, 255, 0.9)",
              textDecoration: "none",
              fontWeight: "500",
              ":hover": {
                color: "#4fc3f7",
                textDecoration: "underline",
              },
            }}
          >
            Farras Syuja
          </a>
        </div>
      </div>

      {selectedPlanet && (
        <div
          style={{
            position: "fixed",
            bottom: "1rem",
            left: "1rem",
            right: "1rem",
            transform: "none",
            color: "white",
            zIndex: 100,
            background: "rgba(10, 5, 30, 0.95)",
            padding: "0.8rem",
            borderRadius: "12px",
            fontSize: "clamp(0.75rem, 3vw, 0.9rem)",
            textAlign: "center",
            border: "1px solid rgba(100, 150, 255, 0.3)",
            boxShadow: "0 0 20px rgba(100, 150, 255, 0.3)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            overflow: "hidden",
            margin: "0 auto",
            maxWidth: "500px",
            width: "calc(100% - 2rem)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(circle at center, rgba(100, 150, 255, 0.1) 0%, transparent 50%)",
              zIndex: -1,
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
              gap: "0.5rem",
            }}
          >
            <button
              onClick={() => navigatePlanet(-1)}
              style={{
                background: "rgba(100, 150, 255, 0.3)",
                border: "none",
                color: "white",
                borderRadius: "50%",
                width: "2.5rem",
                height: "2.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                fontSize: "1.2rem",
                flexShrink: 0,
                touchAction: "manipulation",
              }}
              aria-label="Previous planet"
            >
              ←
            </button>

            <h3
              style={{
                fontSize: "clamp(1rem, 4vw, 1.2rem)",
                margin: "0",
                color: "#7ab8ff",
                textShadow: "0 0 8px rgba(122, 184, 255, 0.5)",
                letterSpacing: "0.5px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flexGrow: 1,
              }}
            >
              {selectedPlanet}
            </h3>

            <button
              onClick={() => navigatePlanet(1)}
              style={{
                background: "rgba(100, 150, 255, 0.3)",
                border: "none",
                color: "white",
                borderRadius: "50%",
                width: "2.5rem",
                height: "2.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                fontSize: "1.2rem",
                flexShrink: 0,
                touchAction: "manipulation",
              }}
              aria-label="Next planet"
            >
              →
            </button>
          </div>

          <div
            style={{
              maxHeight: "30vh",
              overflowY: "auto",
              padding: "0 0.5rem",
              lineHeight: "1.5",
              textAlign: "left",
              fontSize: "clamp(0.8rem, 3vw, 0.9rem)",
              color: "rgba(255, 255, 255, 0.9)",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.3) transparent",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {selectedPlanet
              ? PlanetFacts[selectedPlanet].split("\n").map((line, i) => (
                  <p
                    key={i}
                    style={{
                      margin: "0.5rem 0",
                      wordBreak: "break-word",
                    }}
                  >
                    {line}
                  </p>
                ))
              : "Farras Syuja"}
          </div>

          <style>
            {`
        @media (hover: none) {
          button {
            min-width: 44px;
            min-height: 44px;
          }
        }
        @keyframes twinkle {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }
      `}
          </style>
        </div>
      )}
      <Canvas
        style={{ background: "black" }}
        camera={{ position: [-50, 10, -15], fov: 50 }}
        onCreated={({ camera }) => setMainCamera(camera)}
      >
        <ambientLight intensity={0.5} />
        <Background />
        <pointLight position={[0, 0, 0]} intensity={2} />
        <OrbitControls
          enabled={!selectedPlanet}
          minDistance={8}
          maxDistance={90}
          ref={controlsRef}
          enablePan={false}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: null,
          }}
        />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.5}
            luminanceSmoothing={0.5}
            intensity={1}
          />
        </EffectComposer>
        <Suspense fallback={null}>
          <Particles />
        </Suspense>
        <Sun />
        <Suspense fallback={null}>
          {planetNames.map((planet) => (
            <Planet
              key={planet}
              name={planet}
              radius={
                {
                  Merkurius: 9.3,
                  Venus: 13.5,
                  Bumi: 18.0,
                  Mars: 24.0,
                  Jupiter: 37.0,
                  Saturnus: 50.0,
                  Uranus: 70.0,
                  Neptunus: 85.0,
                }[planet]
              }
              baseSpeed={
                {
                  Merkurius: 0.047,
                  Venus: 0.035,
                  Bumi: 0.03,
                  Mars: 0.024,
                  Jupiter: 0.013,
                  Saturnus: 0.009,
                  Uranus: 0.006,
                  Neptunus: 0.005,
                }[planet]
              }
              modelPath={`/models/${planet.toLowerCase()}.glb`}
              size={
                {
                  Merkurius: 0.5,
                  Venus: 0.3,
                  Bumi: 1,
                  Mars: 0.6,
                  Jupiter: 0.07,
                  Saturnus: 2.4,
                  Uranus: 0.06,
                  Neptunus: 1.5,
                }[planet]
              }
              speedMultiplier={speedMultiplier}
              onClick={handlePlanetClick}
              isSelected={selectedPlanet === planet}
            />
          ))}
        </Suspense>
        <Asteroids />
      </Canvas>
    </>
  );
}
