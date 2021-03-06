import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import './style.scss'

import { forwardRef, memo, useImperativeHandle, useRef, useState } from 'react'
import { render } from 'react-dom'

import mapboxgl from 'mapbox-gl'
import {
    FullscreenControl,
    GeolocateControl,
    NavigationControl,
    ScaleControl,
} from 'mapbox-gl'
import ReactMapboxGl, { Layer, Source } from 'react-mapbox-gl'
import DrawControl from 'react-mapbox-gl-draw'

import { defaultDrawStyles } from './style'
import {
    defaultAccessToken,
    defaultCenter,
    defaultZoom,
    workAreaShowFieldDisplay,
    workAreaShowLineDisplay,
    workAreaFillPaint,
    workAreaLinePaint,
    cropsShowFieldDisplay,
    cropsShowLineDisplay,
    cropsFillPaint,
    cropsLinePaint,
} from './config'
import TrackingDrawWrapper from './TrackingDraw/TrackingDrawWrapper'
import RealtimeDrawWrapper from './RealtimeDraw/RealtimeDrawWrapper'
import { FitBounds } from 'react-mapbox-gl/lib/map'
import RecordDraw from './RecordDraw'

// @ts-ignore
mapboxgl.workerClass = require('mapbox-gl/dist/mapbox-gl-csp-worker').default

//@ts-ignore
ReactMapboxGl.workerClass =
    require('mapbox-gl/dist/mapbox-gl-csp-worker').default

type LayerType = 'streets-v11' | 'satellite-v9' | 'light-v10' | 'dark-v10'
interface IMapboxProps {
    accessToken: string
    height: string
    width: string
    maxHeight: string
    maxWidth: string
    drawStyles: any
    displayStyles: any
    center: [number, number]
    zoom: number
    fitBounds: FitBounds
    lockZoom: boolean

    workArea: any
    crops: any
    trackingApiEndpoint: string

    worksApiEndpoint: string
    viewDrawData: any
    viewIndexContextKey: string
    multiple: boolean

    realtimeMode: boolean
    mapInstance: any
}
/**
 * Mapbox module
 *
 * @param {string} workArea WorkArea with GeoJsonSource)
 * @param {string} crops Crops with GeoJsonSource)
 * @param {string} trackingApiEndpoint Endpoint for tracking devices
 *
 * @param {string} worksApiEndpoint Endpoint for viewing working track finished
 */
const Mapbox: any = memo(
    forwardRef<any, Partial<IMapboxProps>>(({ ...props }, ref) => {
        let drawRef: any
        const [visibleLayer, setVisibleLayer] = useState<LayerType>('satellite-v9')
        const mapboxInstance = useRef(null)
        const Map = memo(ReactMapboxGl({
            accessToken: props.accessToken || defaultAccessToken,
            maxZoom: 23,
        }))

        const [currentZoom, setCurrentZoom] = useState(props.zoom)
        const [currentCenter, setCurrentCenter] = useState(props.center)

        const handleChangeLayer = (e: any) => {
            setVisibleLayer(e)
        }

        const menu = (
            <div>
                <div className="layer-control">
                    <button className={`control-option ${visibleLayer==="satellite-v9" ? "control-option-select" : ""}`} onClick={() => handleChangeLayer("satellite-v9")}>Satellite</button>
                    <button className={`control-option ${visibleLayer==="dark-v10" ? "control-option-select" : ""}`} onClick={() => handleChangeLayer("dark-v10")}>Dark</button>
                    <button className={`control-option ${visibleLayer==="light-v10" ? "control-option-select" : ""}`} onClick={() => handleChangeLayer("light-v10")}>Light</button>
                    <button className={`control-option ${visibleLayer==="streets-v11" ? "control-option-select" : ""}`} onClick={() => handleChangeLayer("streets-v11")}>Map</button>
                </div>
            </div>
        )
        class LayerControl {
            _map: any
            _container: any
            onAdd(map: any) {
                this._map = map
                this._container = document.createElement('div')
                this._container.className = 'mapboxgl-ctrl'
                render(menu, this._container)
                return this._container
            }

            onRemove() {
                this._container.parentNode.removeChild(this._container)
                this._map = undefined
            }
        }

        const mapDidLoad = (mapbox: any) => {
            console.log('map render')

            if (props.lockZoom) mapbox.setMinZoom(mapbox.getZoom())
            console.log('zoom: ', mapbox.getZoom())
            // setCurrentZoom(mapbox.getZoom())

            mapboxInstance.current = mapbox
            if (props.mapInstance)
            props.mapInstance.current = mapbox

            mapbox.addControl(new ScaleControl(), 'bottom-left')
            mapbox.addControl(
                new GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true,
                    },
                    trackUserLocation: true,
                    showUserHeading: true,
                }),
                'bottom-right'
            )
            mapbox.addControl(new NavigationControl(), 'bottom-right')
            mapbox.addControl(
                new FullscreenControl({
                    container: document.querySelector('.mapboxgl-map') as any,
                }),
                'bottom-right'
            )
            mapbox.addControl(new LayerControl(), 'top-left')
        }

        useImperativeHandle(ref, () => ({
            getDrawData() {
                const drawData = drawRef.draw.getAll()
                return drawData
            },
        }))

        return (
            <>
                <Map
                    style={`mapbox://styles/mapbox/${visibleLayer}`}
                    containerStyle={{
                        height: props.height || '100vh',
                        width: props.width || '100vw',
                        maxWidth: props.maxWidth || '100%',
                        maxHeight: props.maxHeight || '100%',
                    }}
                    center={props.center || currentCenter || defaultCenter}
                    zoom={[props.zoom || currentZoom || defaultZoom]}
                    onStyleLoad={mapDidLoad}
                    fitBounds={props.fitBounds}
                    fitBoundsOptions={{
                        padding: { top: 10, bottom: 25, left: 15, right: 5 },
                    }}
                >
                    <div className="work-area-display">
                        {props.workArea &&
                            (workAreaShowFieldDisplay ||
                                workAreaShowLineDisplay) && (
                                <Source
                                    id="work_area"
                                    geoJsonSource={props.workArea}
                                />
                            )}
                        {props.workArea && workAreaShowFieldDisplay && (
                            <Layer
                                type="fill"
                                id="polygon-fill"
                                sourceId="work_area"
                                paint={workAreaFillPaint}
                            />
                        )}
                        {props.workArea && workAreaShowLineDisplay && (
                            <Layer
                                type="line"
                                id="lines_work_area"
                                sourceId="work_area"
                                paint={workAreaLinePaint}
                            />
                        )}
                    </div>
                    <div className="crops-display">
                        {props.crops &&
                            (cropsShowFieldDisplay || cropsShowLineDisplay) && (
                                <Source
                                    id="crops"
                                    geoJsonSource={props.crops}
                                />
                            )}
                        {props.crops && cropsShowFieldDisplay && (
                            <Layer
                                type="fill"
                                id="polygon-fill"
                                sourceId="crops"
                                paint={cropsFillPaint}
                            />
                        )}
                        {props.crops && cropsShowLineDisplay && (
                            <Layer
                                type="line"
                                id="lines_crops"
                                sourceId="crops"
                                paint={cropsLinePaint}
                            />
                        )}
                    </div>
                    <div className="tracking-devices-draw">
                        {props.trackingApiEndpoint && (
                            <TrackingDrawWrapper
                                endpoint={props.trackingApiEndpoint}
                                crops={props.crops}
                                zoom={
                                    (
                                        mapboxInstance?.current as any
                                    )?.getZoom() || 16
                                }
                            />
                        )}
                    </div>
                    <div className="tracking-devices-draw">
                        {props.realtimeMode && (
                            <RealtimeDrawWrapper
                                // data={props.realtimeMode}
                                zoom={
                                    (
                                        mapboxInstance?.current as any
                                    )?.getZoom() || 16
                                }
                            />
                        )}
                    </div>

                    {mapboxInstance && (
                        <DrawControl
                            ref={(drawControl) => (drawRef = drawControl)}
                            displayControlsDefault={false}
                            controls={{ polygon: true, trash: true }}
                            default_mode="draw_polygon"
                            position="bottom-right"
                            styles={
                                props.drawStyles
                                    ? props.drawStyles
                                    : defaultDrawStyles
                            }
                        />
                    )}
                    {props.viewDrawData &&
                        (mapboxInstance?.current as any)?.getZoom() && (
                            <RecordDraw
                                data={props.viewDrawData}
                                zoom={
                                    // (
                                    //     mapboxInstance?.current as any
                                    // )?.getZoom()
                                    currentZoom || 20
                                }
                                viewIndexContextKey={props.viewIndexContextKey}
                            />
                        )}
                    {/* {props.viewDrawData &&
                        props.multiple &&
                        props.viewDrawData.map((drawData: any) => (
                            <>
                                {drawData.length > 0 && (
                                    <RecordDraw
                                        data={drawData}
                                        zoom={
                                            (
                                                mapboxInstance?.current as any
                                            )?.getZoom() || 16
                                        }
                                        multiple
                                    />
                                )}
                            </>
                        ))} */}
                </Map>
            </>
        )
    })
)

export default Mapbox
