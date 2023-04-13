import { useState } from 'react'
import { getDistance } from 'geolib';
import './App.css'

import customLocations from './assets/customerLocations.json'
import plantationProjects from './assets/plantationProjects.json'
import {GeolibInputCoordinates} from "geolib/es/types";
import PlantationCard from "./components/PlantationCard";

interface Plantation {
  id: number,
  type: string,
  projectName: string,
  status: string,
  forestOwnership: string,
  forestOwner: string,
  treeQuantity: number,
  location: string,
  coordinatesUrl: string,
  latitude: string,
  longitude: string,
  startId: number,
  endId: number,
  startDate: string,
  comment: string,
  area: string
}

interface Location {
  name: string,
  latitude: number,
  longitude: number
}


function sortPlantationsByDistanceToLocation(plantations: Plantation[], location: Location): Plantation[] {
  return plantations.sort((a, b) => {
    const aCoords = { latitude: Number(a.latitude), longitude: Number(a.longitude) };
    const bCoords = { latitude: Number(b.latitude), longitude: Number(b.longitude) };

    const distanceA = getDistance(location, aCoords);
    const distanceB = getDistance(location, bCoords);
    return distanceA - distanceB;
  })
}

function getDistancesOfNearestThree(plantations: Plantation[], location: Location): { plantation: Plantation, distance: number }[] {
  var distances: { plantation: Plantation, distance: number }[] = []
  for (let i = 0; i < 3; i++ ) {
    let distance = getDistance(location, { latitude: Number(plantations[i].latitude), longitude: Number(plantations[i].longitude) })
    distances.push({ plantation: plantations[i], distance: distance })
  }
  return distances
}

function getNearestPlantations(plantations: Plantation[], location: Location): { plantation: Plantation, distance: number }[] {

  var sortedPlantations = sortPlantationsByDistanceToLocation(plantations, location)

  return getDistancesOfNearestThree(sortedPlantations, location)
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')

  const plantations:Plantation[] = plantationProjects as Plantation[]
  const locations:Location[] = customLocations as Location[]
  const [currentLocation, setCurrentLocation] = useState(locations[0].name)
  const [currentPlantations, setCurrentPlantations] = useState(getNearestPlantations(plantations, locations[0]))




  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    let searchedLocations = locations.filter(e => e.name === event.target.value)
    if (searchedLocations.length > 0) {
      setCurrentPlantations(getNearestPlantations(plantations, searchedLocations[0]))
      setCurrentLocation(searchedLocations[0].name)
    }
  }




  return (
    <div className="App">
      <input
        className="search-input"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
      />
      <h1>{currentLocation}</h1>
      {currentPlantations.map((plantations_distance) => (
              <div className="centered" key={plantations_distance.plantation.id} >
                <PlantationCard projectName={plantations_distance.plantation.projectName} location={plantations_distance.plantation.location} distance={plantations_distance.distance} />
              </div>
              ))}
    </div>
  )
}

export default App
