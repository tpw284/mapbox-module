import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "./style.css";

import {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { render } from "react-dom";

import { Radio, Space } from "antd";

import mapboxgl, { GeoJSONSourceRaw } from "mapbox-gl";
import {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
} from "mapbox-gl";
import ReactMapboxGl, { Layer, Source } from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";

import { defaultDrawStyles } from "./style";
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
} from "./config";
import TrackingDrawWrapper from "./TrackingDraw/TrackingDrawWrapper";
import { FitBounds } from "react-mapbox-gl/lib/map";

// @ts-ignore
mapboxgl.workerClass = require("mapbox-gl/dist/mapbox-gl-csp-worker").default;

//@ts-ignore
ReactMapboxGl.workerClass =
  require("mapbox-gl/dist/mapbox-gl-csp-worker").default;

type LayerType = "streets-v11" | "satellite-v9" | "light-v10" | "dark-v10";
interface IMapboxProps {
  accessToken: string;
  height: string;
  width: string;
  maxHeight: string;
  maxWidth: string;
  drawStyles: any;
  displayStyles: any;
  center: [number, number];
  zoom: number;
  fitBounds: FitBounds;
  workArea: any;
  crops: any;
  trackingApiEndpoint: string;
  lockZoom: boolean;
}

const Mapbox: any = memo(
  forwardRef<any, Partial<IMapboxProps>>(({ ...props }, ref) => {
    let drawRef: any;
    const [visibleLayer, setVisibleLayer] = useState<LayerType>("satellite-v9");
    const mapboxInstance = useRef(null);
    const Map = ReactMapboxGl({
      accessToken: props.accessToken || defaultAccessToken,
      maxZoom: 23,
    });

    const handleChangeLayer = (e: any) => {
      setVisibleLayer(e.target.value);
    };

    const menu = (
      <div className="layers">
        <div className="layer-option">
          <Radio.Group onChange={handleChangeLayer} value={visibleLayer}>
            <Space direction="vertical">
              <Radio value="satellite-v9" className="float-start fs-5">
                satellite
              </Radio>
              <Radio value="light-v10" className="float-start fs-5">
                light
              </Radio>
              <Radio value="dark-v10" className="float-start fs-5">
                dark
              </Radio>
              <Radio value="streets-v11" className="float-start fs-5">
                streets
              </Radio>
            </Space>
          </Radio.Group>
        </div>
      </div>
    );
    class LayerControl {
      _map: any;
      _container: any;
      onAdd(map: any) {
        this._map = map;
        this._container = document.createElement("div");
        this._container.className = "mapboxgl-ctrl";
        render(menu, this._container);
        return this._container;
      }

      onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
      }
    }

    const mapDidLoad = (mapbox: any) => {
      console.log("map render");

      if(props.lockZoom)
      mapbox.setMinZoom(mapbox.getZoom())
      console.log("zoom: ",mapbox.getZoom());

      mapboxInstance.current = mapbox;
      mapbox.addControl(new ScaleControl(), "bottom-left");
      mapbox.addControl(
        new GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        }),
        "bottom-right"
      );
      mapbox.addControl(new NavigationControl(), "bottom-right");
      mapbox.addControl(
        new FullscreenControl({
          container: document.querySelector(".mapboxgl-map") as any,
        }),
        "bottom-right"
      );
      mapbox.addControl(new LayerControl(), "top-right");
    };

    useImperativeHandle(ref, () => ({
      getDrawData() {
        const drawData = drawRef.draw.getAll();
        return drawData;
      },
    }));

    return (
      <div>
        <Map
          style={`mapbox://styles/mapbox/${visibleLayer}`}
          containerStyle={{
            height: props.height || "100vh",
            width: props.width || "100vw",
            maxWidth: props.maxWidth || "100%",
            maxHeight: props.maxHeight || "100%",
          }}
          center={props.center || defaultCenter}
          zoom={props.zoom ? [props.zoom] : defaultZoom}
          onStyleLoad={mapDidLoad}
          fitBounds={props.fitBounds}
          fitBoundsOptions={{
            padding: { top: 10, bottom: 25, left: 15, right: 5 },
          }}
        >
          <div className="data-display">
            {props.workArea &&
              (workAreaShowFieldDisplay || workAreaShowLineDisplay) && (
                <Source id="work_area" geoJsonSource={props.workArea} />
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

            {props.crops && (cropsShowFieldDisplay || cropsShowLineDisplay) && (
              <Source id="crops" geoJsonSource={props.crops} />
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

            <TrackingDrawWrapper
              endpoint={props.trackingApiEndpoint}
              crops={props.crops}
              zoom={(mapboxInstance?.current as any)?.getZoom()}
            />
          </div>

          {mapboxInstance && (
            <DrawControl
              ref={(drawControl) => (drawRef = drawControl)}
              displayControlsDefault={false}
              controls={{ polygon: true, trash: true }}
              default_mode="draw_polygon"
              position="bottom-right"
              styles={props.drawStyles ? props.drawStyles : defaultDrawStyles}
            />
          )}
        </Map>
      </div>
    );
  })
);

export default Mapbox;
