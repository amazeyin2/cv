import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Html, Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

// 极简几何体：Wireframe 二十面体
function CenterGeometry() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // 缓慢自转
      meshRef.current.rotation.y += 0.002
      meshRef.current.rotation.x += 0.001

      // 鼠标视差
      const mouse = state.pointer
      meshRef.current.rotation.y += mouse.x * 0.0005
      meshRef.current.rotation.x += mouse.y * 0.0005
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[2, 0]} />
        <meshBasicMaterial
          color={hovered ? '#00f0ff' : '#a5f3fc'}
          wireframe
          transparent
          opacity={hovered ? 0.8 : 0.4}
        />
      </mesh>
    </Float>
  )
}

// 技能点星座
function SkillConstellation() {
  const skills = [
    { name: 'Java', pos: [3.1, 2.2, -2] },
    { name: 'AI', pos: [0, 0, -2.5] },
    { name: 'Spring', pos: [3.8, 0.5, -1.8] },
    { name: 'AI', pos: [0, 0, -2.5] },
    { name: 'Python', pos: [-3.2, 2.5, -2.8] },
    { name: 'Linux', pos: [-2.3, 0.8, -1.5] },
    { name: 'RaspberryPi', pos: [-3.6, 1, -1.2] },
    { name: 'MySQL', pos: [-3, -0.8, -2.2] },
    { name: 'H5', pos: [-1.8, -2.2, -2] },
    { name: 'AI', pos: [0, 0, -2.5] },
    { name: 'RAG', pos: [0.5, -3, -2.3] },
    { name: 'C#', pos: [2.2, -1.8, -2.6] },
    { name: 'Docker', pos: [3.5, -1, -1.2] },
    { name: 'Redis', pos: [0.6, 2.8, -2.2] },
  ]

  return (
    <group>
      {skills.map((skill, i) => (
        <SkillPoint key={i} position={skill.pos as [number, number, number]} label={skill.name} />
      ))}
      {/* 连线 */}
      {skills.map((skill, i) => {
        if (i < skills.length - 1) {
          const next = skills[i + 1]
          return <SkillLine key={`line-${i}`} start={skill.pos as [number, number, number]} end={next.pos as [number, number, number]} />
        }
        return null
      })}
    </group>
  )
}

function SkillPoint({ position, label }: { position: [number, number, number]; label: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <mesh
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={hovered ? 1 : 0.6} />
      </mesh>
      <Html position={[position[0], position[1] + 0.3, position[2]]} center>
        <div className="px-2 py-0.5 bg-black/70 border border-cyber-cyan/50 text-cyber-cyan text-[10px] rounded backdrop-blur-sm whitespace-nowrap pointer-events-none">
          {label}
        </div>
      </Html>
    </>
  )
}

function SkillLine({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: '#00ffff', transparent: true, opacity: 0.8 }))} />
  )
}

// 粒子场背景（移动端简化）
function ParticleField() {
  const points = useRef<THREE.Points>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // 移动端减少粒子数量以提升性能
  const particlesCount = isMobile ? 200 : 800
  const positions = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 40
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.03 : 0.02}
        color="#00f0ff"
        transparent
        opacity={isMobile ? 0.2 : 0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// 相机控制器（滚轮推拉）
function CameraController() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useFrame(() => {
    if (cameraRef.current) {
      const scrollY = window.scrollY || window.pageYOffset
      const targetZ = 8 - scrollY * 0.01
      cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, Math.max(3, targetZ), 0.05)
    }
  })

  return (
    <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 8]} fov={50} />
  )
}

// 3D 场景
function Scene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <>
      <CameraController />
      <ambientLight intensity={0.3} />
      <CenterGeometry />
      {/* 移动端隐藏技能星座以提升性能 */}
      {!isMobile && <SkillConstellation />}
      <ParticleField />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

// 终端窗口组件（右侧，移动端下方）
function TerminalWindow() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <motion.div
      initial={{ opacity: 0, ...(isMobile ? {} : { x: 50 }) }}
      animate={{ opacity: 1, ...(isMobile ? {} : { x: 0 }) }}
      transition={{ duration: 1, delay: 0.5 }}
      className="fixed left-1/2 -translate-x-1/2 bottom-[10%] md:left-auto md:right-[5%] md:translate-x-0 md:top-[20%] md:bottom-auto pointer-events-auto z-10"
    >
      <div className="w-[calc(100vw-2rem)] max-w-[400px] md:w-[450px] bg-black/80 backdrop-blur-md border border-cyber-cyan/30 rounded-lg overflow-hidden shadow-2xl">
        {/* 终端顶栏 */}
        <div className="h-7 md:h-8 bg-gradient-to-b from-cyber-cyan/20 to-cyber-cyan/5 border-b border-cyber-cyan/30 flex items-center px-3">
          <div className="flex gap-1.5 md:gap-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/70"></div>
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/70"></div>
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/70"></div>
          </div>
          <div className="flex-1 text-center text-cyber-cyan/60 text-[10px] md:text-xs font-light tracking-wider">
            amazeyin - bash
          </div>
        </div>

        {/* 终端内容 */}
        <div className="p-2.5 md:p-4 font-mono text-[9px] md:text-sm leading-relaxed space-y-1 md:space-y-2 max-h-[30vh] md:max-h-[350px] overflow-y-auto">
          <div className="flex gap-1.5 md:gap-2 flex-wrap">
            <span className="text-green-400">root@amazeyin</span>
            <span className="text-blue-400">~</span>
            <span className="text-cyber-pale/60">cat /me.txt</span>
          </div>
          <p className="text-cyber-pale/80 pl-1.5 md:pl-4">爱好计算机，会去自学自己感兴趣的一切东西</p>
          <p className="text-cyber-pale/80 pl-1.5 md:pl-4">略懂Python，H5，C#开发；爱好折腾去解决一切问题</p>
          <p className="text-cyber-pale/80 pl-1.5 md:pl-4">同时我也很喜欢玩硬件，raspberry Pi是我的最爱</p>
          <p className="text-cyber-pale/80 pl-1.5 md:pl-4">这条路我才刚刚迈开了我的第一步</p>
          <p className="text-cyber-pale/80 pl-1.5 md:pl-4">路上的坎一定会非常多，但</p>
          <p className="text-cyber-pale/80 pl-1.5 md:pl-4">在我眼里</p>
          <p className="text-cyber-pale/80 pl-1.5 md:pl-4">没有什么问题是尝试不能解决的，如果有那就多尝试几次甚至上百次</p>
          <p className="text-cyber-cyan pl-1.5 md:pl-4 text-glow-sm">即使前方的路看似绝境，也要有硬生生给自己开出一条路的勇气</p>
          <div className="flex gap-1.5 md:gap-2 mt-1.5 md:mt-3 flex-wrap">
            <span className="text-green-400">root@amazeyin</span>
            <span className="text-blue-400">~</span>
            <span className="text-cyber-pale/60">sudo rm -rf /过去的自己/*</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// 个人卡片组件（左侧，移动端上方）
function ProfileCard() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <motion.div
      initial={{ opacity: 0, ...(isMobile ? {} : { x: -50 }) }}
      animate={{ opacity: 1, ...(isMobile ? {} : { x: 0 }) }}
      transition={{ duration: 1, delay: 0.7 }}
      className="fixed left-1/2 -translate-x-1/2 top-[20%] md:left-[10%] md:translate-x-0 md:top-[20%] pointer-events-auto z-10"
    >
      <div className="w-[calc(100vw-2rem)] max-w-[260px] md:w-[280px] bg-black/70 backdrop-blur-md border border-cyber-cyan/30 rounded-2xl overflow-hidden shadow-2xl hover:border-cyber-cyan/60 transition-all duration-300">
        {/* 头像 */}
        <div className="pt-5 md:pt-8 pb-2.5 md:pb-4">
          <div className="w-20 h-20 md:w-32 md:h-32 mx-auto rounded-full border-4 border-cyber-cyan/40 overflow-hidden hover:border-cyber-cyan hover:scale-105 transition-all duration-500">
            <img
              src="/img/header.jpeg"
              alt="Amazeyin"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 名字 */}
        <div className="text-center">
          <h2 className="text-lg md:text-2xl font-light text-cyber-cyan text-glow tracking-widest">Amazeyin</h2>
          <div className="w-4/5 h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent mx-auto my-2.5 md:my-4"></div>
        </div>

        {/* 介绍 */}
        <div className="px-3 md:px-6 pb-3 md:pb-6 text-center space-y-0.5 md:space-y-2 text-[11px] md:text-sm text-cyber-pale/70">
          <p>一条咸鱼🐟</p>
          <p>爱好计算机</p>
          <p>Java开发工程狮🦁</p>
          <p>瞎折腾浪费时间最在行</p>
          <p>最爱🎮</p>
        </div>

        {/* 按钮 */}
        <div className="flex border-t border-cyber-cyan/20">
          <a
            href="https://blog.csdn.net/qq_21917033"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 md:py-3 text-center text-cyber-light/60 text-[11px] md:text-sm hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-all duration-300 border-r border-cyber-cyan/20 active:bg-cyber-cyan/20"
          >
            关于
          </a>
          <a
            href="https://blog.csdn.net/qq_21917033"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 md:py-3 text-center text-cyber-light/60 text-[11px] md:text-sm hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-all duration-300 active:bg-cyber-cyan/20"
          >
            联系
          </a>
        </div>
      </div>
    </motion.div>
  )
}

// 主应用
export default function App() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      <Canvas
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* 浮动元素层 */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 顶部居中标题 */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute top-8 md:top-12 left-0 right-0 flex justify-center items-center pointer-events-none"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-thin tracking-[0.3em] text-cyber-cyan text-glow">
            AMAZE.YIN
          </h1>
        </motion.div>

        {/* 底部链接 */}
        <div className="absolute bottom-16 md:bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="flex gap-4 md:gap-8 text-cyber-light/50 text-xs md:text-sm"
          >
            <a
              href="https://blog.csdn.net/qq_21917033"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyber-cyan hover:text-glow-sm active:text-cyber-cyan transition-all duration-300"
            >
              Blog
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyber-cyan hover:text-glow-sm active:text-cyber-cyan transition-all duration-300"
            >
              Note
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyber-cyan hover:text-glow-sm active:text-cyber-cyan transition-all duration-300"
            >
              McBlog
            </a>
          </motion.div>
        </div>

        {/* ICP 备案 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 text-cyber-cyan/20 text-[8px] md:text-[10px] tracking-wide pointer-events-auto text-center px-4"
        >
          <p className="whitespace-nowrap">
            © 2020 AMAZEYIN |
            <a
              href="http://beian.miit.gov.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyber-cyan/50 active:text-cyber-cyan/50 transition-colors ml-1"
            >
              苏ICP备2023036105号-1
            </a>
          </p>
        </motion.div>
      </div>

      {/* 可拖拽的终端和卡片 */}
      <TerminalWindow />
      <ProfileCard />
    </div>
  )
}
