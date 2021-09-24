import { useContext, useEffect, useState } from "react";
import { Layer, Marker, Source } from "react-mapbox-gl";
import * as turf from "@turf/turf";

import { ViewIndexContext } from "../../RecordMap/RecordMap";

import PaintScaleView from "../../utils/PaintScaleView";

const RecordDraw = ({ data, zoom }: any) => {
  const [displayDrawData, setDisplayDrawData] = useState<any>({
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    },
  });
  const [deviceCoordinate, setDeviceCoordinate] = useState([100,20])
  const viewIndex = useContext(ViewIndexContext);

  useEffect(() => {
    if (data)
      setDisplayDrawData({
        type: "geojson",
        data: turf.lineString(data),
      });
      setDeviceCoordinate(data[data.length-1])
  }, []);

  useEffect(() => {
    const showPoint = data.slice(0, viewIndex + 1);
    if (showPoint.length >= 2) {
      setDisplayDrawData({
        type: "geojson",
        data: turf.lineString(showPoint),
      });
      console.log(showPoint[viewIndex-1])
      setDeviceCoordinate(showPoint[viewIndex-1])
    }
    else {
      setDisplayDrawData({
        type: "geojson",
        data: turf.point(showPoint[0]),
      });
      setDeviceCoordinate(showPoint[0])
    }
  }, [viewIndex]);

  useEffect(() => {
    console.log("view render", data.length);
  });

  return (
    <div>
      <Source id="view-device" geoJsonSource={displayDrawData} />
      <Layer
        type="line"
        id="view-device"
        sourceId="view-device"
        paint={PaintScaleView(1, zoom)}
      />
      <Marker
        coordinates={deviceCoordinate}
        anchor="center"
      >
        <img src="https://i.ibb.co/WP8VqMv/3.png" style={{ height: "40px" }} />
      </Marker>
    </div>
  );
};

export default RecordDraw;
