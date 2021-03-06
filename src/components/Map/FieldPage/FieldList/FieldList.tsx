import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Table } from "antd";
import Modal from "antd/lib/modal/Modal";
import { WarningFilled } from "@ant-design/icons";
import "./style.css";
export interface IFieldData {
  id: number;
  device_id: number;
  machine_id: number;
  create_time: string;
  update_time: string;
}

interface IFieldListProps {
  data: IFieldData[];
}

const FieldList = ({ data }: Partial<IFieldListProps>) => {
  const history = useHistory();

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>();
  const [tableData, setTableData] = useState<any>();

  useEffect(() => {  
    setTableData(
      data?.map((field) => {
        return {
          id: field?.id,
          device: field?.device_id,
          machine: field?.machine_id,
          createdAt: new Date(field?.create_time).toLocaleString(),
          updatedAt: new Date(field?.update_time).toLocaleString(),
          key: field?.create_time,
        };
      })
    );
  }, [data]);

  const changeConfirmModal = () => {
    setShowConfirm(!showConfirm);
  };

  const columns: any = [
    {
      width: "4%",
      title: "id",
      key: "id",
      dataIndex: "id",
      render: (text: any, record: any) => (
        <div>ID: {record.id}</div>
      ),
    },
    {
      title: "",
      key: "image",
      dataIndex: "image",
      width: 50,
      render: () => (
        <img
          alt="no?"
          src="https://s3-ap-northeast-1.amazonaws.com/agri-info-design-public/icons/ic_person_black_48dp.png"
          className="align-self-center"
          style={{ height: "40px" }}
        ></img>
      ),
    },
    {
      title: "Info",
      dataIndex: "info",
      key: "info",
      width: 800,
      render: (text: any, record: any) => (
        <div>
          <div className="fw-bold fs-6">Deivce: {record.device}</div>
          <div className="fw-bold fs-6">Machine: {record.machine}</div>

          {/* <div className="fw-bold fs-6">{record.area} m2</div> */}
        </div>
      ),
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 1000,
      responsive: ["sm"],
      render: (text: any, record: any) => (
        <div>
          <div>Created Time: {record.createdAt}</div>
          <div>Updated Time: {record.updatedAt}</div>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record: any) => (
        <div className="control-buttons">
          <Link to={`/fields/${record.id}`}>
            <Button type="primary" size="large">
              Detail
            </Button>
          </Link>

          <Button
            type="primary"
            danger
            size="large"
            onClick={() => {
              changeConfirmModal();
              setDeleteItem(record);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = () => {
    // TODO: CALL DELETE API
    localStorage.removeItem(deleteItem.name);
    localStorage.setItem(
      "fakeDB",
      JSON.stringify(
        JSON.parse(localStorage.getItem("fakeDB")!).filter((item: any) => {
          return item !== deleteItem.name;
        })
      )
    );
    setShowConfirm(false);

    const newFieldData = data?.filter((field: any) => {
      return field.name !== deleteItem.name;
    });
    setTableData(newFieldData);
    setDeleteItem(data);
  };

  return (
    <div className="p-3">
      <div className="title text-start fw-bold fs-3 mb-3 d-flex ">
        <div>Field List</div>
        <div className="ms-4">
          <Button onClick={() => history.push("/fields/create")}>
            Create Field
          </Button>
        </div>
        <div className="ms-4">
          <Button onClick={() => history.push("/fields/card")}>Card View</Button>
        </div>
      </div>
      <div>
        <Table dataSource={tableData} columns={columns} showHeader={false} />
      </div>
      <div>
        <Modal
          visible={showConfirm}
          onOk={handleDelete}
          onCancel={changeConfirmModal}
          okText="OK"
          cancelText="Cancel"
        >
          <div>
            <WarningFilled
              style={{ fontSize: "30px", margin: "0 10px", color: "gray" }}
            />
            Are you sure want to delete Field "{deleteItem?.device}"
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default FieldList;
