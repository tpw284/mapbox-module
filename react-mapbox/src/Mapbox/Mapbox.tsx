import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "./style.css";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { render } from "react-dom";
import { FullscreenControl, GeolocateControl, NavigationControl } from "mapbox-gl";
import ReactMapboxGl, { Layer, Source } from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";
import { styles } from "./style";
import {
  accessToken,
  defaultCenter,
  defaultZoom,
  fillPaint,
  linePaint,
  showFieldDisplay,
  showLineDisplay,
} from "./config";

type LayerType = "streets-v11" | "satellite-v9" | "light-v10" | "dark-v10";

const Mapbox = forwardRef((props, ref) => {
  let drawRef: any;
  const [visibleLayer, setVisibleLayer] = useState<LayerType>("satellite-v9");
  const mapboxInstance = useRef(null);

  const fieldData = localStorage.getItem("fields");
  let JSONData = "";
  if (fieldData) JSONData = JSON.parse(fieldData);
  const dataSource = {
    type: "geojson",
    data: JSONData,
  };

  const Map = ReactMapboxGl({
    accessToken: accessToken,
  });

  const handleChangeLayer = (e: any) => {
    setVisibleLayer(e.target.id);
  };

  const menu = (
    <div className="layers">
      <div className="layer-option">
        <input
          id="satellite-v9"
          type="radio"
          name="rtoggle"
          value="satellite"
          onClick={handleChangeLayer}
          checked={visibleLayer === "satellite-v9"}
        ></input>
        <label className="layer-label">satellite</label>
      </div>
      <div className="layer-option">
        <input
          id="light-v10"
          type="radio"
          name="rtoggle"
          value="light"
          onClick={handleChangeLayer}
          checked={visibleLayer === "light-v10"}
        ></input>
        <label className="layer-label">light</label>
      </div>
      <div className="layer-option">
        <input
          id="dark-v10"
          type="radio"
          name="rtoggle"
          value="dark"
          onClick={handleChangeLayer}
          checked={visibleLayer === "dark-v10"}
        ></input>
        <label className="layer-label">dark</label>
      </div>
      <div className="layer-option">
        <input
          id="streets-v11"
          type="radio"
          name="rtoggle"
          value="streets"
          onClick={handleChangeLayer}
          checked={visibleLayer === "streets-v11"}
        ></input>
        <label className="layer-label">streets</label>
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
    mapboxInstance.current = mapbox;
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
      new FullscreenControl({ container: document.querySelector("body") }),
      "bottom-right"
    );
    mapbox.addControl(new LayerControl(), "top-right");
  };

  useImperativeHandle(ref, () => ({
    saveData() {
      const drawData = drawRef.draw.getAll();
      let updateGeoJSONData;
      const oldData = localStorage.getItem("fields");
      if (oldData) {
        updateGeoJSONData = {
          type: "FeatureCollection",
          features: [...JSON.parse(oldData).features, ...drawData.features],
        };
      } else updateGeoJSONData = drawData;
      localStorage.setItem("fields", JSON.stringify(updateGeoJSONData));
    },
  }));

  const onDrawCreate = ({ features }: any) => {
    console.log(features);
  };

  const onDrawUpdate = ({ features }: any) => {
    console.log(features, "ehe");
  };

  return (
    <div>
      <Map
        style={`mapbox://styles/mapbox/${visibleLayer}`}
        containerStyle={{
          height: "80vh",
          width: "80vw",
        }}
        center={defaultCenter}
        zoom={defaultZoom}
        onStyleLoad={mapDidLoad}
      >
        <div className="data-display">
          {(showFieldDisplay || showLineDisplay) && (
            <Source id="source_id" geoJsonSource={dataSource} />
          )}
          {showFieldDisplay && (
            <Layer
              type="fill"
              id="polygon-fill"
              sourceId="source_id"
              paint={fillPaint}
            />
          )}
          {showLineDisplay && (
            <Layer
              type="line"
              id="lines"
              sourceId="source_id"
              paint={linePaint}
            />
          )}
        </div>

        <DrawControl
          ref={(drawControl) => (drawRef = drawControl)}
          displayControlsDefault={false}
          controls={{ polygon: true, trash: true }}
          default_mode="draw_polygon"
          onDrawCreate={onDrawCreate}
          onDrawUpdate={onDrawUpdate}
          styles={styles}
          position="bottom-right"
        />
      </Map>
    </div>
  );
});

export default Mapbox;
