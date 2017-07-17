import {bindContext} from './util'
import * as THREE from 'three'
import * as _ from 'lodash'
import * as colors from './colors'


export default class Hero {
  constructor({selContainer}) {
    this.elContainer = document.querySelector(selContainer)

    this.objectSize = 10
    this.objectDepth = 200
    this.objectDefaultZ = 0 - (this.objectDepth / 2)
    this.objectCountX = 21
    this.objectCountY = 20
    this.objectSpeed = 0.03
    this.objectDirectionChangeChance = 0
    this.objectMinZ = this.objectDefaultZ
    this.objectZDiff = 3
    this.objectMaxZ = this.objectMinZ + this.objectZDiff
    this.mouseRotationDampenX = 70000
    this.mouseRotationDampenY = 20000
    this.cameraRotXTarget = 0
    this.cameraRotYTarget = 0
    this.cameraRotXSpeed = 0.1
    this.cameraRotYSpeed = 0.1

    this.updateDimensions()

    this.scene = this.makeScene()
    this.camera = this.makeCamera()
    this.renderer = this.makeRenderer()
    this.makeObjects()
    this.lights = this.makeLights()

    Dom(window).bind('resize', () => this.updateAndEnactDimensions())
    Dom(this.elContainer).bind('mousemove', this.reactToMouse.bind(this))

    this.enactDimensions()
    this.render()
  }

  reactToMouse(event) {
    const mouseXOnMove = event.clientX - (this.width / 2)
    this.cameraRotYTarget = -mouseXOnMove / this.mouseRotationDampenX

    const mouseYOnMove = event.clientY - (this.height / 2)
    this.cameraRotXTarget = -mouseYOnMove / this.mouseRotationDampenY
  }

  updateCameraRotation() {
    this.camera.rotation.x += (this.cameraRotXTarget - this.camera.rotation.x) * this.cameraRotXSpeed
    this.camera.rotation.y += (this.cameraRotYTarget - this.camera.rotation.y) * this.cameraRotYSpeed
  }

  randomizeObjectDirections() {
    this.objectDirections = this.objectDirections.map((direction, index) => {
      let object = this.objects[index]
      let isObjectTooHigh = object.position.z > this.objectMaxZ
      let isObjectTooLow = object.position.z < this.objectMinZ
      let wasRollSuccessful = Math.random() < this.objectDirectionChangeChance
      if (isObjectTooHigh || isObjectTooLow || wasRollSuccessful) {
        return direction * -1
      } else {
        return direction
      }
    })
  }

  updateObjectPositions() {
    this.objects.forEach((object, index) => {
      let change = this.objectSpeed * this.objectDirections[index]
      object.position.z += change
    })
  }

  animate() {
    this.randomizeObjectDirections()
    this.updateObjectPositions()
    this.updateCameraRotation()
  }

  render() {
    this.animate()
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(() => this.render())
  }

  makeScene() {
    let scene = new THREE.Scene()
    return scene
  }

  makeCamera() {
    // Depends on dimensions
    let camera = new THREE.PerspectiveCamera(this.cameraFov, this.aspectRatio, 0.1, 1000)
    camera.up = new THREE.Vector3(0, 1, 0)
    camera.rotation.x = this.cameraAngle
    camera.position.z = this.cameraZ
    return camera
  }

  makeRenderer() {
    // Depends on dimensions
    let renderer = new THREE.WebGLRenderer({
      antialiasing: true,
      alpha: true,
    })
    // renderer.shadowMap.enabled = true
    // renderer.shadowMap.soft = true
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(this.width, this.height)
    this.elContainer.appendChild(renderer.domElement)
    return renderer
  }

  makeObjectGeometry({width, height, depth}) {
    return new THREE.CubeGeometry(width, height, depth)
  }

  makeObject(x, y) {
    let colorSet = colors.GRAPHIQ3_12_LOWER
    let colorIndex = _.random(2, 4)
    let colorCode = colorSet[colorIndex]
    let color = parseInt(colorCode.slice(1), 16)

    let material = new THREE.MeshLambertMaterial({color: color})

    let geometry = this.makeObjectGeometry({
      width: this.objectSize,
      height: this.objectSize,
      depth: this.objectDepth,
    })

    let mesh = new THREE.Mesh(geometry, material)
    // mesh.castShadow = true
    // mesh.receiveShadow = true

    let objectZ = this.objectDefaultZ + (_.random(0, this.objectZDiff * 10) / 10)
    mesh.position.set(x, y, objectZ)

    this.scene.add(mesh)

    return mesh
  }

  makeObjects() {
    const xRange = _.range(0 - this.objectCountX, this.objectCountX)
    const yRange = _.range(0 - this.objectCountY, this.objectCountY)
    let objects = xRange.reduce((xObjects, xIndex) => {
      let yObjects = yRange.reduce((yObjects, yIndex) => {
        let object = this.makeObject(
          this.objectSize * xIndex,
          this.objectSize * yIndex,
        )
        return yObjects.concat([object])
      }, [])
      return xObjects.concat(yObjects)
    }, [])

    this.objects = objects
    this.objectDirections = this.objects.map(() => [-1, 1][_.random(0, 1)])
  }

  setLightShadow(light) {
    light.castShadow = true
    light.shadow.mapSize.width = 8000
    light.shadow.mapSize.height = 8000
    light.shadow.camera.left = -200
    light.shadow.camera.right = 200
    light.shadow.camera.top = 200
    light.shadow.camera.bottom = -200
    light.shadow.camera.far = 2000
  }

  makeLights() {
    let ambientLight = new THREE.AmbientLight(0xffffff)
    ambientLight.intensity = 1.2
    this.scene.add(ambientLight)

    let dirLight = new THREE.DirectionalLight(0xffffff)
    dirLight.intensity = 0.3
    dirLight.position.set(200, 150, 80)
    // this.setLightShadow(dirLight)
    this.scene.add(dirLight)
  }

  updateDimensions() {
    this.width = this.elContainer.offsetWidth
    this.height = this.elContainer.offsetHeight
    this.aspectRatio = this.width / this.height
    this.cameraFov = 100
    this.cameraZ = 80
    this.cameraAngle = 0 * Math.PI / 180
  }

  enactDimensions() {
    this.camera.aspect = this.aspectRatio
    this.camera.fov = this.cameraFov
    this.camera.rotation.x = this.cameraAngle
    this.camera.position.z = this.cameraZ
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
  }

  updateAndEnactDimensions() {
    this.updateDimensions()
    this.enactDimensions()
  }
}
