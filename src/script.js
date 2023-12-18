import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'


const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()



// textures

const textureLoader = new THREE.TextureLoader()
const glassColor = textureLoader.load('/Glass_Window_003_SD/Glass_Window_003_basecolor.jpg')
const glassNormal = textureLoader.load('/Glass_Window_003_SD/Glass_Window_003_normal.jpg')
const glassAmbiet = textureLoader.load('/Glass_Window_003_SD/Glass_Window_003_ambientOcclusion.jpg')
const glassRough = textureLoader.load('/Glass_Window_003_SD/Glass_Window_003_roughness.jpg')
const glassOpacity = textureLoader.load('/Glass_Window_003_SD/Glass_Window_003_opacity.jpg')
const glassMetalic = textureLoader.load('/Glass_Window_003_SD/Glass_Window_003_metallic.jpg')
const particleTexture = textureLoader.load('/particles/symbol_02.png')


glassColor.repeat.set(2, 2);
glassNormal.repeat.set(2, 2);
glassAmbiet.repeat.set(2, 2);
glassRough.repeat.set(2, 2);
glassOpacity.repeat.set(2, 2);
glassMetalic.repeat.set(2, 2);

glassColor.wrapS = THREE.RepeatWrapping;
glassColor.wrapT = THREE.RepeatWrapping;
glassNormal.wrapS = THREE.RepeatWrapping;
glassNormal.wrapT = THREE.RepeatWrapping;
glassAmbiet.wrapS = THREE.RepeatWrapping;
glassAmbiet.wrapT = THREE.RepeatWrapping;
glassRough.wrapS = THREE.RepeatWrapping;
glassRough.wrapT = THREE.RepeatWrapping;
glassOpacity.wrapS = THREE.RepeatWrapping;
glassOpacity.wrapT = THREE.RepeatWrapping;
glassMetalic.wrapS = THREE.RepeatWrapping;
glassMetalic.wrapT = THREE.RepeatWrapping;


//objects
const objectDistance = 4
const box = new THREE.Mesh(
    new THREE.OctahedronGeometry(),
    new THREE.MeshNormalMaterial()
)


const x = 0, y = 0;
const heartShape = new THREE.Shape();
heartShape.moveTo( x + 5, y + 5 );
heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );
const heart = new THREE.Mesh(
    new THREE.ShapeGeometry( heartShape ),
    new THREE.MeshStandardMaterial({ color: 'red' ,emissive: 'crimson', side: THREE.DoubleSide})
)
heart.scale.set(.01,.01,.01)
heart.rotation.x = Math.PI

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    new THREE.MeshStandardMaterial({
        map: glassColor,             
        normalMap: glassNormal,      
        aoMap: glassAmbiet,          
        roughnessMap: glassRough,    
        alphaMap: glassOpacity,      
        metalnessMap: glassMetalic,  
        opacity: 1.0,
        metalness: 2,
        roughness: 1
    })
)
sphere.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(sphere.geometry.attributes.uv.array, 2)
)


box.position.y = - objectDistance * 0
sphere.position.y = - objectDistance * 1
heart.position.y = - objectDistance * 2
box.position.x = -1
sphere.position.x = 1
heart.position.x = 2

const particleCount = 250
const positions = new Float32Array(particleCount * 3)
for(let i = 0; i < particleCount; i++) {
    positions[i * 3 + 0 ] = (Math.random() - .5) * 10
    positions[i * 3 + 1 ] = objectDistance * .5 - (Math.random() * objectDistance * 3)
    positions[i * 3 + 2 ] = (Math.random() - .5) * 3
}

const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const particleMaterial = new THREE.PointsMaterial({
    alphaMap: particleTexture,
    transparent:true,
    size: 0.25,
    sizeAttenuation: true,
    alphaTest: 0.001,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
})
const particles = new THREE.Points(particleGeometry,particleMaterial)



scene.add(box, sphere, heart, particles)





// group 
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

//camera
const size = { width: window.innerWidth, height: window.innerHeight}
const aspectRatio = size.width / size.height
const camera = new THREE.PerspectiveCamera(35, aspectRatio, 0.1, 100)
camera.position.z = 4
cameraGroup.add(camera)



// light 
const ambientLight = new THREE.AmbientLight('gray', .5)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight('white', 2)
scene.add(directionalLight)
directionalLight.position.set(4,2,5)
// const helper = new THREE.DirectionalLightHelper(directionalLight)
// scene.add(helper)






//renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
})
renderer.setClearAlpha(.2)
renderer.setSize(size.width, size.height)
renderer.render(scene,camera)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


window.addEventListener('resize', ()=> {
    size.width = window.innerWidth
    size.height = window.innerHeight
    camera.aspect = aspectRatio
    camera.updateProjectionMatrix()
    renderer.setSize(size.width, size.height)
})

// scroll
let scrollY = window.scrollY
// let currentSection = 0
window.addEventListener('scroll', ()=> {
    scrollY = window.scrollY
    // const newSection = Math.round(scrollY / size.height)
    // console.log(newSection);
    // if(newSection != currentSection) {
    //     currentSection = newSection
    //     gsap.to(
    //         meshes[currentSection].rotation, {
    //             duration: 1.5,
    //             ease: 'power2.inOut',
    //             x: '+=6',
    //             y: '+=3'
    //         }
    //     )
    // }
})

//mouse position
const cursor = {}
cursor.x = 0
cursor.y = 0
window.addEventListener('mousemove', (event)=> {
    cursor.x = event.clientX / size.width - .5
    cursor.y = event.clientY / size.height - .5
})



const meshes = [sphere, box]
const clock = new THREE.Clock()
let previousTime = 0
const tick = ()=> {
    camera.position.y = -scrollY /size.height * objectDistance
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    const parralxX = cursor.x
    const parralxY = - cursor.y
    cameraGroup.position.x += (parralxX - cameraGroup.position.x) * 2.5 * deltaTime
    cameraGroup.position.y += (parralxY - cameraGroup.position.y) * 2.5 * deltaTime

    for(const mesh of meshes){
        mesh.rotation.x += deltaTime * .22
        mesh.rotation.y += deltaTime * .12
    }
    heart.position.x = (Math.sin(elapsedTime) / 4)  - objectDistance /2
    heart.position.y = (Math.cos(elapsedTime) / 2) - objectDistance * 2
    heart.rotation.z = elapsedTime
    heart.rotation.y = elapsedTime 
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick();