import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "antd";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import "./User.css";

const UserListWrapper = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("new");
  const [dataList, setDataList] = useState([]);
  const [singleData, setSingleData] = useState({});

  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mobile No.",
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Actions",
      dataIndex: "key",
      key: "key",
      render: (text, obj) => (
        <div style={{ display: "flex" }}>
          <div style={{ paddingRight: "10px" }}>
            <span
              style={{ cursor: "pointer" }}
              className="fa fa-pencil"
              onClick={() => editUser(obj)}
            ></span>
          </div>
          <div>
            <span
              style={{ cursor: "pointer" }}
              className="fa fa-trash"
              onClick={() => deleteUser(obj.id)}
            ></span>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    let localData = localStorage.getItem("userData");
    if (localData) {
      setDataList(JSON.parse(localData));
    }
  }, []);

  const editUser = (data) => {
    setModalType("edit");
    setSingleData({ ...data });
    setIsModalOpen(true);
  };

  const deleteUser = (id) => {
    let isDelete = window.confirm("Are you sure you want to delete?");
    if (isDelete) {
      let localData = JSON.parse(localStorage.getItem("userData"));
      let findInd = localData.findIndex((x) => x.id === id);
      if (findInd !== -1) {
        localData.splice(findInd, 1);
        localStorage.setItem("userData", JSON.stringify(localData));
        window.location.reload();
      }
    }
  };

  const reusableFun = () => {
    setModalType("new");
    setSingleData({});
    setIsModalOpen(false);
    window.location.reload();
  };

  const saveUser = (data) => {
    let localData = JSON.parse(localStorage.getItem("userData"));
    if (modalType === "new") {
      if (localData) {
        let fil = localData.filter((x) => x.name === data.name);
        if (fil.length > 0) {
          alert("User Name already exist");
        } else {
          let singleObj = { ...data };
          singleObj["id"] = Math.random();
          localData.push(singleObj);
          localStorage.setItem("userData", JSON.stringify(localData));
          reusableFun();
        }
      } else {
        let arr = [];
        let singleObj = { ...data };
        singleObj["id"] = Math.random();
        arr.push(singleObj);
        localStorage.setItem("userData", JSON.stringify(arr));
        reusableFun();
      }
    } else {
      let fil = localData.filter(
        (element) => element.name === data.name && element.id !== singleData.id
      );
      if (fil.length > 0) {
        alert("User Name already exist");
      } else {
        let findInd = localData.findIndex((x) => x.id === singleData.id);
        let singleObj = { ...data, id: singleData.id };
        localData.splice(findInd, 1, singleObj);
        localStorage.setItem("userData", JSON.stringify(localData));
        reusableFun();
      }
    }
  };

  return (
    <div className="userListWrapper">
      <div className="addUserBtn">
        <Button
          type="primary"
          onClick={() => {
            setModalType("new");
            setIsModalOpen(true);
          }}
        >
          Add User
        </Button>
      </div>
      <Table
        pagination={true}
        rowKey="id"
        dataSource={dataList}
        columns={columns}
      />
      <Modal
        title={modalType === "new" ? "Add User" : "Update User"}
        open={isModalOpen}
        footer={null}
      >
        <Formik
          initialValues={{
            name: singleData?.name ? singleData.name : "",
            mobileNo: singleData?.mobileNo ? singleData.mobileNo : "",
            email: singleData?.email ? singleData.email : "",
            address: singleData?.address ? singleData.address : "",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .min(1, "Minimum 1 characters")
              .max(15, "Maximum 15 characters")
              .required("User Name is required."),
            mobileNo: Yup.string()
              .max(10, "Maximum 10 digit allowed.")
              .min(10, "Minimum 10 digit allowed.")
              .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Enter valid mobile no")
              .required("Mobile No is required."),
            email: Yup.string()
              .matches(/[^@]+@[^@]+\.[^@]+/, "Enter valid email")
              .max(255, "Maximum 255 character allowed.")
              .required("Email is required."),
            address: Yup.string().required("Address is required."),
          })}
          onSubmit={(fields) => {
            saveUser(fields);
          }}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <div className="formControlSpace">
                <Field
                  type="text"
                  name="name"
                  autoComplete="off"
                  placeholder={"User Name"}
                  className="formControl"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="errorMsg"
                />
              </div>
              <div className="formControlSpace">
                <Field
                  type="text"
                  name="mobileNo"
                  autoComplete="off"
                  placeholder={"Mobile No"}
                  className="formControl"
                />
                <ErrorMessage
                  name="mobileNo"
                  component="div"
                  className="errorMsg"
                />
              </div>
              <div className="formControlSpace">
                <Field
                  type="email"
                  name="email"
                  autoComplete="off"
                  placeholder={"Email"}
                  className="formControl"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="errorMsg"
                />
              </div>
              <div className="formControlSpace">
                <Field
                  type="address"
                  name="address"
                  autoComplete="off"
                  placeholder={"Address"}
                  className="formControl"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="errorMsg"
                />
              </div>
              <div className="modalFooter">
                <button
                  type="button"
                  onClick={() => {
                    setModalType("new");
                    setIsModalOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="saveBtn">
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default UserListWrapper;
