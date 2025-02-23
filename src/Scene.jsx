import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, Suspense, useEffect } from "react";
import { OrbitControls, Trail, Text, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const planetFacts = {
    Merkurius: "Planet ini mengalami perbedaan suhu yang ekstrem,\n"
    + "dengan suhu siang hari yang bisa mencapai sekitar 430°C akibat kedekatannya dengan Matahari,\n"
    + "sementara di malam hari suhu bisa turun drastis hingga -180°C karena tidak memiliki atmosfer yang cukup untuk mempertahankan panas.",

Venus: "Dikenal sebagai planet paling panas di Tata Surya,\n"
    + "Venus memiliki atmosfer yang sangat tebal dan kaya akan karbon dioksida,\n"
    + "menciptakan efek rumah kaca ekstrem yang membuat suhunya mencapai sekitar 475°C,\n"
    + "bahkan lebih panas daripada Merkurius meskipun lebih jauh dari Matahari.",

Bumi: "Satu-satunya planet yang diketahui memiliki kehidupan,\n"
    + "Bumi terdiri dari 71% air di permukaannya dan memiliki atmosfer yang kaya akan oksigen\n"
    + "serta lapisan pelindung ozon yang memungkinkan makhluk hidup berkembang.",

Mars: "Dijuluki sebagai 'Planet Merah' karena permukaannya yang dipenuhi debu dan batuan kaya besi oksida,\n"
    + "Mars juga memiliki gunung tertinggi di Tata Surya, yaitu Olympus Mons,\n"
    + "yang tingginya mencapai sekitar 22 kilometer, hampir tiga kali lebih tinggi dari Gunung Everest.",

Jupiter: "Sebagai planet terbesar di Tata Surya, Jupiter memiliki Bintik Merah Besar,\n"
    + "yaitu badai raksasa yang telah berputar selama lebih dari 300 tahun,\n"
    + "serta lebih dari 90 bulan yang mengorbitnya, termasuk Ganymede,\n"
    + "bulan terbesar yang bahkan lebih besar dari Merkurius.",

Saturnus: "Terkenal dengan sistem cincinnya yang paling mencolok dan luas,\n"
    + "cincin Saturnus sebenarnya terdiri dari miliaran partikel es dan batu yang berputar mengelilinginya dengan kecepatan tinggi,\n"
    + "menciptakan pemandangan yang spektakuler di Tata Surya.",

Uranus: "Tidak seperti planet lain, Uranus berotasi hampir horizontal dengan kemiringan sumbu mencapai 98 derajat,\n"
    + "membuatnya tampak berguling saat mengorbit Matahari,\n"
    + "dan atmosfernya kaya akan metana, yang memberikan warna biru kehijauan khasnya.",

Neptunus: "Sebagai planet terjauh dari Matahari, Neptunus memiliki angin tercepat di Tata Surya\n"
    + "yang dapat mencapai lebih dari 2.000 km/jam,\n"
    + "serta badai gelap besar yang mirip dengan Bintik Merah Besar di Jupiter,\n"
    + "meskipun lebih kecil dan sering berubah posisi."
};

function Sun() {
    return (
        <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[5.963, 32, 32]} />
            <meshStandardMaterial emissive="yellow" emissiveIntensity={2} />
        </mesh>
    );
}
function Planet({ name, radius, baseSpeed, modelPath, size, speedMultiplier, onClick, isSelected }) {
    const planetRef = useRef();
    const textRef = useRef();
    const timeRef = useRef(0);
    const { camera } = useThree();
    const { scene } = useGLTF(modelPath);
    
    useFrame(() => {
        if (planetRef.current) {
            timeRef.current += baseSpeed * speedMultiplier;
            planetRef.current.position.x = Math.cos(timeRef.current) * radius;
            planetRef.current.position.z = Math.sin(timeRef.current) * radius;
            planetRef.current.rotation.y += baseSpeed * 0.5;

            if (textRef.current) {
                const textOffset = size + (name === "Jupiter" || name === "Uranus" ? 4 : 1);
                textRef.current.position.set(
                    planetRef.current.position.x,
                    planetRef.current.position.y + textOffset,
                    planetRef.current.position.z
                );
                textRef.current.lookAt(camera.position);
            }

            if (isSelected) {
                camera.position.lerp(
                    new THREE.Vector3(
                        planetRef.current.position.x - 10,
                        planetRef.current.position.y + 10,
                        planetRef.current.position.z
                    ),
                    0.1
                );
                camera.lookAt(planetRef.current.position);
            }
        }
    });

    return (
        <>
            <Trail local width={0.1} length={5} color="white" attenuation={(t) => t * t}>
                <primitive ref={planetRef} object={scene} scale={size} onClick={() => onClick(name)} />
            </Trail>
            <Text ref={textRef} color="white" anchorX="center" anchorY="middle" fontSize={0.6}>
                {name}
            </Text>


        </>
    );
}




function Particles() {
    const particlesRef = useRef();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 200;
        positions[i3 + 1] = (Math.random() - 0.5) * 200;
        positions[i3 + 2] = (Math.random() - 0.5) * 200;

        velocities[i3] = (Math.random() - 0.5) * 0.05;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.05;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;

        const color = Math.random() > 0.9 ? new THREE.Color("yellow") : new THREE.Color("white");
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    useFrame(() => {
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] += velocities[i];
            if (positions[i] > 100 || positions[i] < -100) velocities[i] *= -1;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" array={positions} count={particleCount} itemSize={3} />
                <bufferAttribute attach="attributes-color" array={colors} count={particleCount} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.5} vertexColors depthWrite={false} transparent={true} opacity={0.8} />
        </points>
    );
}


function Asteroids() {
    const asteroids = new Array(50).fill(0).map(() => ({
        position: [
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 200
        ],
        size: Math.random() * 0.4 + 0.1
    }));
    return asteroids.map((asteroid, i) => (
        <mesh key={i} position={asteroid.position}>
            <sphereGeometry args={[asteroid.size, 8, 8]} />
            <meshStandardMaterial color="brown" />
        </mesh>
    ));
}

export default function Scene() {
    const [speedMultiplier, setSpeedMultiplier] = useState(1);
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const planetNames = Object.keys(planetFacts);


    const handlePlanetClick = (planetName) => {
        if (selectedPlanet === planetName) {
            setSelectedPlanet(null);
            camera.position.lerp(initialCameraPosition, 0.1);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        } else {
            setSelectedPlanet(planetName);
        }
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
            <div style={{ position: "absolute", top: "1rem", left: "1rem", color: "white", zIndex: 100 }}>
                <label>Kecepatan Orbit: </label>
                <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={speedMultiplier}
                    onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                />
            </div>

            <div
    style={{
        position: "absolute",
        top: "1rem",
        right: isMobile ? "15%" : "1rem",
        transform: isMobile ? "translateX(50%)" : "none",
        color: "white",
        zIndex: 100,
        textAlign: "center",
        fontSize: isMobile ? "0.8rem" : "0.9rem",
        background: "rgba(0, 0, 0, 0.7)",
        padding: "0.8rem",
        borderRadius: "5px",
        maxWidth: isMobile ? "90vw" : "150px",
        overflowY: "auto",
        marginTop: "1rem", 
    }}
>
    <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Daftar Planet</h3>
    {planetNames.map((planet) => (
        <div
            key={planet}
            style={{
                cursor: "pointer",
                padding: "5px",
                background: selectedPlanet === planet ? "gray" : "transparent",
                fontSize: "0.8rem",
                borderRadius: "3px",
                textAlign: "center",
            }}
            onClick={() => handlePlanetClick(planet)}
        >
            {planet}
        </div>
    ))}
</div>


<div
    style={{
        position: "absolute",
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        color: "white",
        zIndex: 100,
        background: "rgba(0, 0, 0, 0.7)",
        padding: isMobile ? "0.5rem" : "0.8rem",
        borderRadius: "5px",
        width: isMobile ? "90%" : "80%",
        maxWidth: isMobile ? "300px" : "400px",
        fontSize: isMobile ? "0.75rem" : "0.9rem",
        textAlign: "center",
        marginTop: "2px",
        overflowY: "auto",
        maxHeight: "150px",
    }}
>
    <h3 style={{ fontSize: isMobile ? "0.9rem" : "1rem", marginBottom: "0.3rem" }}>
        {selectedPlanet}
    </h3>
    <p style={{ lineHeight: "1.2", fontSize: isMobile ? "0.7rem" : "0.9rem" }}>
    {selectedPlanet ? planetFacts[selectedPlanet] : "Farras Syuja"}
    </p>
</div>

            <Canvas style={{ background: "black" }} camera={{ position: [-50, 10, -15], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[0, 0, 0]} intensity={2} />
                <OrbitControls enabled={!selectedPlanet} minDistance={8} maxDistance={120} />
                <EffectComposer>
                    <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.5} intensity={1} />
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
                            radius={{ Merkurius: 9.3, Venus: 13.5, Bumi: 18.0, Mars: 24.0, Jupiter: 37.0, Saturnus: 50.0, Uranus: 70.0, Neptunus: 85.0 }[planet]}
                            baseSpeed={{ Merkurius: 0.047, Venus: 0.035, Bumi: 0.03, Mars: 0.024, Jupiter: 0.013, Saturnus: 0.009, Uranus: 0.006, Neptunus: 0.005 }[planet]}
                            modelPath={`/models/${planet.toLowerCase()}.glb`}
                            size={{ Merkurius: 0.5, Venus: 0.3, Bumi: 1, Mars: 0.6, Jupiter: 0.07, Saturnus: 2.4, Uranus: 0.06, Neptunus: 1.5 }[planet]}
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
