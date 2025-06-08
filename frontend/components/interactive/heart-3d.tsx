"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useTheme } from "next-themes"

interface Heart3DProps {
  width?: number
  height?: number
  className?: string
  onClick?: () => void
}

export function Heart3D({ width = 300, height = 300, className = "", onClick }: Heart3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const heartRef = useRef<THREE.Mesh | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const frameRef = useRef<number>(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const { theme } = useTheme()

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5
    controlsRef.current = controls

    // Create heart shape
    const heartShape = new THREE.Shape()
    const x = 0,
      y = 0

    heartShape.moveTo(x, y)
    heartShape.bezierCurveTo(x + 2.5, y + 2.5, x + 2.0, y + 3.0, x, y + 3.0)
    heartShape.bezierCurveTo(x - 2.0, y + 3.0, x - 2.5, y + 2.5, x, y)

    const extrudeSettings = {
      depth: 1,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.5,
      bevelThickness: 0.5,
    }

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings)

    // Create material
    const material = new THREE.MeshPhongMaterial({
      color: theme === "dark" ? 0xff2b7a : 0xff1a5e,
      shininess: 100,
      specular: 0x111111,
    })

    // Create mesh
    const heart = new THREE.Mesh(geometry, material)
    heart.scale.set(0.5, 0.5, 0.5)
    heart.rotation.x = Math.PI
    heart.position.y = 1
    scene.add(heart)
    heartRef.current = heart

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xff3366, 2, 10)
    pointLight.position.set(0, 0, 3)
    scene.add(pointLight)

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      if (heartRef.current && !isAnimating) {
        heartRef.current.rotation.y += 0.01
      }

      if (controlsRef.current) {
        controlsRef.current.update()
      }

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }

      if (heartRef.current) {
        heartRef.current.geometry.dispose()
        if (Array.isArray(heartRef.current.material)) {
          heartRef.current.material.forEach((material) => material.dispose())
        } else {
          heartRef.current.material.dispose()
        }
      }
    }
  }, [width, height, theme])

  // Update on theme change
  useEffect(() => {
    if (heartRef.current && heartRef.current.material) {
      const material = heartRef.current.material as THREE.MeshPhongMaterial
      material.color.set(theme === "dark" ? 0xff2b7a : 0xff1a5e)
    }
  }, [theme])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current && containerRef.current) {
        const newWidth = containerRef.current.clientWidth
        const newHeight = height

        cameraRef.current.aspect = newWidth / newHeight
        cameraRef.current.updateProjectionMatrix()

        rendererRef.current.setSize(newWidth, newHeight)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [height])

  // Handle click - animate heart
  const handleClick = () => {
    if (!heartRef.current || isAnimating) return

    setIsAnimating(true)

    // Create a pulse animation
    const startScale = heartRef.current.scale.x
    const targetScale = startScale * 1.3
    const duration = 500 // ms
    const startTime = Date.now()

    const animatePulse = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease in-out function
      const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

      if (heartRef.current) {
        if (progress < 0.5) {
          // Growing
          const scale = startScale + (targetScale - startScale) * easeInOut(progress * 2)
          heartRef.current.scale.set(scale, scale, scale)
        } else {
          // Shrinking
          const scale = targetScale - (targetScale - startScale) * easeInOut((progress - 0.5) * 2)
          heartRef.current.scale.set(scale, scale, scale)
        }

        if (progress < 1) {
          requestAnimationFrame(animatePulse)
        } else {
          heartRef.current.scale.set(startScale, startScale, startScale)
          setIsAnimating(false)
          if (onClick) onClick()
        }
      }
    }

    animatePulse()
  }

  return (
    <div
      ref={containerRef}
      className={`relative cursor-pointer ${className}`}
      style={{ width: "100%", height: `${height}px` }}
      onClick={handleClick}
    >
      <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground">
        Click to interact or drag to rotate
      </div>
    </div>
  )
}

