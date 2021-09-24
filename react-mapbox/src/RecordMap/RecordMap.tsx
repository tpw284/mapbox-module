import { createContext, useEffect, useState } from "react";
import { Legend, Line, LineChart, Tooltip } from "recharts";
import * as turf from "@turf/turf";

import Mapbox from "../Mapbox";

export const ViewIndexContext = createContext<any>(null);

const RecordMap = () => {
  const [recordData, setRecordData] = useState<any>();
  const [drawData, setDrawData] = useState<any>();
  const [viewIndex, setViewIndex] = useState(0);

  useEffect(() => {
    const getRecordData = async () => {
      let data;
      try {
        data = await fetch(
          process.env.REACT_APP_API_URL +
            "/get_track?last_index=0&track_id=0&short=true",
          {
            method: "GET",
          }
        ).then((data) => data.json());
      } catch (error) {
        console.log(error);
      }
      if (data) {
        const points = data.track[0].points;
        const multiplier = data.track[0].multiplier;
        const startPoint = data.track[0].start_point;
        let convertData: any[] = [];
        let distance = [
          {
            distance: 0,
          },
        ];
        let from;
        let to = [0, 0];
        for (let i = 0; i < points.length; i += 2) {
          const currentCoord = [
            startPoint[1] + points[i + 1] * multiplier,
            startPoint[0] + points[i] * multiplier,
          ];
          convertData.push(currentCoord);
          from = to;
          to = currentCoord;
          if (i > 0) {
            distance.push({
              distance:
                distance[distance.length - 1].distance +
                turf.distance(turf.point(from), turf.point(to)) * 1000,
            });
          }
        }
        setRecordData(distance);
        setDrawData(convertData);
        setViewIndex(convertData.length);
      }
    };
    getRecordData();
  }, []);

  const handleClick = (e: any, payload: any) => {
    setViewIndex(payload.index);
    console.log(viewIndex);
    console.log("cloick");
  };

  return (
    <div>
      <div className="record-info"></div>

      <div className="record-map">
        <ViewIndexContext.Provider value={viewIndex}>
          <Mapbox
            height="calc(70vh - 125px)"
            viewDrawData={drawData}
            center={drawData ? drawData[0] : undefined}
          ></Mapbox>
        </ViewIndexContext.Provider>
      </div>

      <div className="record-chart">
        <LineChart
          width={2100}
          height={365}
          margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
          data={recordData}
        >
          <Line
            stroke="#8884d8"
            strokeWidth={3}
            dataKey="distance"
            type="monotone"
            dot={false}
            activeDot={{ onClick: handleClick, r: 10 }}
          />
          {/* <CartesianGrid stroke="#ccc" /> */}
          {/* <XAxis dataKey="name" /> */}
          {/* <YAxis /> */}
          <Legend verticalAlign="top" align="left" iconSize={30} height={36} />
          <Tooltip />
        </LineChart>
      </div>
    </div>
  );
};

export default RecordMap;
