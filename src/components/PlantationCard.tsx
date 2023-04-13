
type PlantationCardProps = {
    projectName: string,
    location: string,
    distance: number
}

export const PlantationCard = ({ projectName, location, distance }: PlantationCardProps ) => {
    return (
            <div className="card">
                <h2>{projectName}</h2>
                <p>{location}</p>
                <p>{distance % 1000.0}km</p>
            </div>
    )
}

export default PlantationCard