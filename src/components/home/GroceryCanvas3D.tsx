import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface GroceryCanvas3DProps {
  className?: string
}

const checkWebGLAvailable = () => {
  if (typeof window === 'undefined') return true
  try {
    const testCanvas = document.createElement('canvas')
    return Boolean(
      testCanvas.getContext('webgl') ||
        testCanvas.getContext('experimental-webgl')
    )
  } catch {
    return false
  }
}

export const GroceryCanvas3D: React.FC<GroceryCanvas3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isReducedMotion = useRef(false)
  const [hasWebGL] = useState(checkWebGLAvailable)

  useEffect(() => {
    if (!hasWebGL) return

    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    isReducedMotion.current = mediaQuery.matches
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion.current = e.matches
    }
    mediaQuery.addEventListener('change', handleMotionChange)

    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 400
    const height = container.clientHeight || 420

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000)
    camera.position.set(0, 1.2, 5.8)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15

    container.appendChild(renderer.domElement)

    // 2. Realistic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfdfbf7, 1.2)
    scene.add(ambientLight)

    // Key Light (Warm golden sunlight)
    const keyLight = new THREE.DirectionalLight(0xfff5dd, 2.4)
    keyLight.position.set(4, 6, 4)
    scene.add(keyLight)

    // Fill Light (Soft morning glow from left)
    const fillLight = new THREE.DirectionalLight(0xdcfce7, 1.2)
    fillLight.position.set(-4, 3, 2)
    scene.add(fillLight)

    // Rim Light (Lime/Forest sheen for edge separation)
    const rimLight = new THREE.DirectionalLight(0xa3e635, 1.8)
    rimLight.position.set(0, 4, -4)
    scene.add(rimLight)

    // 3. Central Interactive Group
    const group = new THREE.Group()
    scene.add(group)

    // Ground Soft Pedestal Disc
    const pedestalGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.12, 48)
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x143d2b,
      roughness: 0.7,
      metalness: 0.1,
    })
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat)
    pedestal.position.y = -1.35
    group.add(pedestal)

    // Accent Ring on Pedestal
    const ringGeo = new THREE.TorusGeometry(2.42, 0.04, 16, 64)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x84cc16,
      roughness: 0.3,
      metalness: 0.8,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.y = -1.3
    group.add(ring)

    // Item 1: Chakki Flour Sack (گندم کا آٹا بوری)
    const sackGroup = new THREE.Group()
    sackGroup.position.set(-0.85, -0.2, 0.2)

    // Sack body
    const sackBodyGeo = new THREE.CylinderGeometry(0.68, 0.76, 1.5, 32)
    const sackMat = new THREE.MeshStandardMaterial({
      color: 0xf1e7d0,
      roughness: 0.85,
      metalness: 0.05,
    })
    const sackBody = new THREE.Mesh(sackBodyGeo, sackMat)
    sackGroup.add(sackBody)

    // Sack neck tied top
    const sackTopGeo = new THREE.ConeGeometry(0.5, 0.45, 24)
    const sackTop = new THREE.Mesh(sackTopGeo, sackMat)
    sackTop.position.y = 0.9
    sackGroup.add(sackTop)

    // Tied rope string
    const ropeGeo = new THREE.TorusGeometry(0.35, 0.05, 12, 32)
    const ropeMat = new THREE.MeshStandardMaterial({
      color: 0x854d0e,
      roughness: 0.9,
    })
    const rope = new THREE.Mesh(ropeGeo, ropeMat)
    rope.rotation.x = Math.PI / 2
    rope.position.y = 0.75
    sackGroup.add(rope)

    // Green stamp badge on sack
    const stampGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.02, 24)
    const stampMat = new THREE.MeshStandardMaterial({
      color: 0x1b4332,
      roughness: 0.4,
    })
    const stamp = new THREE.Mesh(stampGeo, stampMat)
    stamp.rotation.x = Math.PI / 2
    stamp.position.set(0, 0.05, 0.72)
    sackGroup.add(stamp)

    group.add(sackGroup)

    // Item 2: Banaspati Ghee / Cooking Oil Tin Can (ڈالڈا گھی کین)
    const tinGroup = new THREE.Group()
    tinGroup.position.set(0.9, -0.3, 0.3)

    const tinBodyGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.35, 36)
    const tinMat = new THREE.MeshStandardMaterial({
      color: 0xfaf5ea,
      metalness: 0.55,
      roughness: 0.25,
    })
    const tinBody = new THREE.Mesh(tinBodyGeo, tinMat)
    tinGroup.add(tinBody)

    // Emerald brand banner wrap
    const bandGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.55, 36)
    const bandMat = new THREE.MeshStandardMaterial({
      color: 0x2d6a4f,
      metalness: 0.35,
      roughness: 0.3,
    })
    const band = new THREE.Mesh(bandGeo, bandMat)
    band.position.y = 0.05
    tinGroup.add(band)

    // Gold lid rim
    const lidGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.08, 36)
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      metalness: 0.85,
      roughness: 0.2,
    })
    const lid = new THREE.Mesh(lidGeo, goldMat)
    lid.position.y = 0.71
    tinGroup.add(lid)

    // Tin handle
    const handleGeo = new THREE.TorusGeometry(0.25, 0.035, 12, 24, Math.PI)
    const handle = new THREE.Mesh(handleGeo, goldMat)
    handle.position.set(0, 0.82, 0)
    handle.rotation.z = Math.PI
    tinGroup.add(handle)

    group.add(tinGroup)

    // Item 3: Tapal Danedar Tea Jar / Canister (چائے جار)
    const teaGroup = new THREE.Group()
    teaGroup.position.set(0.1, -0.45, 0.95)

    const jarGeo = new THREE.CylinderGeometry(0.4, 0.42, 0.9, 32)
    const jarMat = new THREE.MeshStandardMaterial({
      color: 0x1b4332,
      roughness: 0.2,
      metalness: 0.4,
    })
    const jar = new THREE.Mesh(jarGeo, jarMat)
    teaGroup.add(jar)

    // Lime accent label band
    const labelGeo = new THREE.CylinderGeometry(0.405, 0.405, 0.4, 32)
    const labelMat = new THREE.MeshStandardMaterial({
      color: 0x84cc16,
      roughness: 0.35,
      metalness: 0.1,
    })
    const label = new THREE.Mesh(labelGeo, labelMat)
    label.position.y = 0.02
    teaGroup.add(label)

    // Brass jar cap
    const capGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.1, 32)
    const cap = new THREE.Mesh(capGeo, goldMat)
    cap.position.y = 0.48
    teaGroup.add(cap)

    group.add(teaGroup)

    // Item 4: Floating Spice & Golden Grain Particles
    const particleCount = 28
    const particlesGroup = new THREE.Group()
    const grainGeo = new THREE.DodecahedronGeometry(0.07, 0)
    const grainMat = new THREE.MeshStandardMaterial({
      color: 0x84cc16,
      emissive: 0x224400,
      roughness: 0.3,
      metalness: 0.7,
    })

    const particleMeshes: {
      mesh: THREE.Mesh
      initialY: number
      speed: number
      radius: number
      angle: number
    }[] = []

    for (let i = 0; i < particleCount; i++) {
      const pMesh = new THREE.Mesh(grainGeo, grainMat)
      const radius = 1.4 + Math.random() * 1.5
      const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.5
      const initialY = -0.8 + Math.random() * 2.2

      pMesh.position.set(
        Math.cos(angle) * radius,
        initialY,
        Math.sin(angle) * radius
      )
      const scale = 0.4 + Math.random() * 0.8
      pMesh.scale.set(scale, scale, scale)

      particlesGroup.add(pMesh)
      particleMeshes.push({
        mesh: pMesh,
        initialY,
        speed: 0.5 + Math.random() * 1.2,
        radius,
        angle,
      })
    }
    group.add(particlesGroup)

    // 4. Mouse and Touch Interaction Handlers
    let targetRotationX = 0.08
    let targetRotationY = 0
    let mouseX = 0
    let mouseY = 0
    let isDragging = false
    let previousPointerX = 0
    let previousPointerY = 0

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      previousPointerX = clientX
      previousPointerY = clientY
    }

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      if (isDragging) {
        const deltaX = clientX - previousPointerX
        const deltaY = clientY - previousPointerY

        targetRotationY += deltaX * 0.008
        targetRotationX += deltaY * 0.005
        targetRotationX = Math.max(-0.35, Math.min(0.45, targetRotationX))

        previousPointerX = clientX
        previousPointerY = clientY
      } else if (!isReducedMotion.current) {
        const rect = container.getBoundingClientRect()
        mouseX = ((clientX - rect.left) / rect.width) * 2 - 1
        mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1)
      }
    }

    const handlePointerUp = () => {
      isDragging = false
    }

    const dom = renderer.domElement
    dom.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('mouseup', handlePointerUp)

    dom.addEventListener('touchstart', handlePointerDown, { passive: true })
    window.addEventListener('touchmove', handlePointerMove, { passive: true })
    window.addEventListener('touchend', handlePointerUp)

    // 5. Visibility Observer (Pause rendering when off-screen to conserve GPU)
    let isVisible = true
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting
      },
      { threshold: 0.1 }
    )
    observer.observe(container)

    // 6. Animation Loop
    let animationId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      if (!isVisible) return

      const elapsedTime = clock.getElapsedTime()

      if (!isReducedMotion.current) {
        // Subtle floating movement
        group.position.y = Math.sin(elapsedTime * 1.2) * 0.08

        // Idle slow rotation when not dragging
        if (!isDragging) {
          targetRotationY += 0.002
          targetRotationY += (mouseX * 0.4 - targetRotationY) * 0.02
          targetRotationX += (mouseY * 0.2 + 0.1 - targetRotationX) * 0.02
        }

        // Particle floating orbit
        particleMeshes.forEach((item, idx) => {
          const pAngle = item.angle + elapsedTime * 0.25 * item.speed
          item.mesh.position.x = Math.cos(pAngle) * item.radius
          item.mesh.position.z = Math.sin(pAngle) * item.radius
          item.mesh.position.y =
            item.initialY + Math.sin(elapsedTime * 2 + idx) * 0.15
          item.mesh.rotation.y += 0.02
        })
      }

      // Smooth lerp rotation
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.08
      group.rotation.x += (targetRotationX - group.rotation.x) * 0.08

      renderer.render(scene, camera)
    }

    animate()

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      if (newWidth === 0 || newHeight === 0) return

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', handleResize)

    const handleContextLost = (e: Event) => {
      e.preventDefault()
      cancelAnimationFrame(animationId)
    }
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost)

    return () => {
      cancelAnimationFrame(animationId)
      observer.disconnect()
      mediaQuery.removeEventListener('change', handleMotionChange)
      window.removeEventListener('resize', handleResize)

      dom.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('mouseup', handlePointerUp)

      dom.removeEventListener('touchstart', handlePointerDown)
      window.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('touchend', handlePointerUp)

      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost)

      // Traverse and dispose all geometries and materials to prevent GPU leaks
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose()
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose())
          } else {
            obj.material?.dispose()
          }
        }
      })

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [hasWebGL])

  if (!hasWebGL) {
    // High fidelity CSS 3D fallback if WebGL is unavailable
    return (
      <div className={`relative flex items-center justify-center p-6 ${className}`}>
        <div className="w-64 h-64 rounded-full bg-forest-800/20 border-2 border-forest-600/30 flex flex-col items-center justify-center text-center p-6 shadow-forest-lg">
          <div className="w-20 h-20 rounded-2xl bg-forest-700 text-lime-brand flex items-center justify-center text-3xl font-bold font-urdu mb-3 shadow-md">
            ح
          </div>
          <h4 className="font-bold text-forest-900 text-sm">Hafiz G 3D Store</h4>
          <p className="text-xs text-forest-700/70 mt-1">
            Civil Bazar K-152, Attock City • Fresh Chakki Atta & Pure Chai
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[360px] sm:h-[440px] lg:h-[480px] cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Interactive 3D Display - Drag to rotate items"
    >
      {/* 3D Interactive Badge Helper */}
      <div className="absolute bottom-3 right-3 sm:right-6 z-10 bg-forest-950/70 backdrop-blur-md text-lime-brand text-[10px] font-semibold px-2.5 py-1 rounded-full border border-forest-700/50 flex items-center gap-1.5 shadow-2xs pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-lime-brand animate-ping motion-reduce:animate-none" />
        <span>3D Interactive • Drag to Inspect</span>
      </div>
    </div>
  )
}
