import React, { useCallback, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { clearSessionInfo } from "../../utils/session"; // Adjust path if needed
import {
  Container,
  Card,
  CardBody,
  Button,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import "./Profile.css";
import DateTimePickerComp from "../../ReusableComponents/DateTimePickerComp/DateTimePickerComp";
import Moment from "moment";
import moment from "moment";

function Profile() {
  const navigate = useNavigate();

  // Calculate date restrictions
  const today = Moment();
  const maxDate = today; // Cannot select dates beyond today
  const minDate = Moment("01-01-1990", "DD-MM-YYYY"); // Cannot select dates more than 110 years ago

  // Original data to revert to when canceling
  const originalData = useMemo(
    () => ({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "+961 70 123 456",
      DOB: "01-01-1990",
      pin: "1234",
      biometricType: "none", // "none", "faceid", "fingerprint"
      biometricEnabled: false,
    }),
    []
  );

  // Consolidated state management
  const [state, setState] = useState({
    // Form fields
    firstName: originalData.firstName,
    lastName: originalData.lastName,
    email: originalData.email,
    phoneNumber: originalData.phoneNumber,
    DOB: originalData.DOB,
    pin: originalData.pin,
    biometricType: originalData.biometricType,
    biometricEnabled: originalData.biometricEnabled,

    // UI state
    isEditing: false,
    isPinVisible: false,
    isSettingUpBiometric: false,
  });

  // Handle form field changes with useCallback
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setState((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  // Handle date of birth changes with useCallback
  const handleChangeDOB = useCallback((value) => {
    setState((prevData) => ({
      ...prevData,
      DOB: value,
    }));
  }, []);

  // Handle logout with useCallback
  const handleLogout = useCallback(() => {
    clearSessionInfo();
    navigate("/login", { replace: true });
  }, [navigate]);

  // Handle cancel with useCallback
  const handleCancel = useCallback(() => {
    // Revert all changes back to original data
    setState((prev) => ({
      ...prev,
      firstName: originalData.firstName,
      lastName: originalData.lastName,
      email: originalData.email,
      phoneNumber: originalData.phoneNumber,
      DOB: originalData.DOB,
      pin: originalData.pin,
      biometricType: originalData.biometricType,
      biometricEnabled: originalData.biometricEnabled,
      isEditing: false,
      isPinVisible: false,
      isSettingUpBiometric: false,
    }));
  }, [originalData]);

  // Handle edit mode toggle with useCallback
  const handleEditing = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isEditing: !prev.isEditing,
    }));
  }, []);

  // Handle save with useCallback
  const handleSave = useCallback(() => {
    // In production, save the data in the state and to the server here.
    console.log("Saving data:", state);

    // Update the original data with the new values
    Object.assign(originalData, {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      phoneNumber: state.phoneNumber,
      DOB: state.DOB,
      pin: state.pin,
      biometricType: state.biometricType,
      biometricEnabled: state.biometricEnabled,
    });

    setState((prev) => ({
      ...prev,
      isEditing: false,
      isSettingUpBiometric: false,
    }));
  }, [state, originalData]);

  // Handle PIN visibility toggle with useCallback
  const togglePinVisibility = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPinVisible: !prev.isPinVisible,
    }));
  }, []);

  // Handle biometric setup with useCallback
  const handleBiometricSetup = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSettingUpBiometric: true,
    }));
  }, []);

  // Handle biometric type change with useCallback
  const handleBiometricTypeChange = useCallback((type) => {
    setState((prev) => ({
      ...prev,
      biometricType: type,
      biometricEnabled: type !== "none",
    }));
  }, []);

  // Handle biometric enrollment with useCallback
  const handleBiometricEnrollment = useCallback(async () => {
    try {
      // Simulate biometric enrollment process
      console.log("Enrolling biometric:", state.biometricType);

      // In a real app, you would integrate with WebAuthn API or device biometric APIs
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate enrollment time

      setState((prev) => ({
        ...prev,
        biometricEnabled: true,
        isSettingUpBiometric: false,
      }));

      console.log("Biometric enrollment successful");
    } catch (error) {
      console.error("Biometric enrollment failed:", error);
      // Handle error - maybe show a notification
    }
  }, [state.biometricType]);

  // Handle biometric removal with useCallback
  const handleBiometricRemoval = useCallback(() => {
    setState((prev) => ({
      ...prev,
      biometricType: "none",
      biometricEnabled: false,
    }));
  }, []);

  // Memoized formatted date for display
  const formattedDOB = useMemo(() => {
    return moment(state.DOB).format("DD/MM/YYYY");
  }, [state.DOB]);

  // Check if device supports biometrics
  const deviceSupportsBiometrics = useMemo(() => {
    // In a real app, you would check device capabilities
    // For now, we'll assume modern devices support it
    return true;
  }, []);

  return (
    <>
      <div className="top-bar-profile">
        {state.isEditing ? (
          <>
            <button className="action-link" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <button className="action-link" onClick={handleEditing}>
            Edit
          </button>
        )}
      </div>
      <br />
      <Container className="profile-container mt-2">
        <Card className="profile-card">
          <CardBody>
            <div className="profile-header">
              {/* <img
                src="https://i.pravatar.cc/150"
                alt="User Avatar"
                className="profile-avatar"
              /> */}
              <h1 className="page-title">{state.firstName}</h1>
              <p className="text-small text-secondary">Personal Account</p>
            </div>
            <div className="profile-details">
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={state.firstName}
                  onChange={handleChange}
                  readOnly={!state.isEditing}
                  className={!state.isEditing ? "readonly-input" : ""}
                />
              </FormGroup>

              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={state.lastName}
                  onChange={handleChange}
                  readOnly={!state.isEditing}
                  className={!state.isEditing ? "readonly-input" : ""}
                />
              </FormGroup>

              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={state.email}
                  onChange={handleChange}
                  readOnly={!state.isEditing}
                  className={"readonly-input"}
                />
              </FormGroup>

              <FormGroup>
                <Label for="phoneNumber">Phone Number</Label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={state.phoneNumber}
                  onChange={handleChange}
                  readOnly={!state.isEditing}
                  className={!state.isEditing ? "readonly-input" : ""}
                />
              </FormGroup>

              <FormGroup>
                <Label for="DOB">Date of Birth</Label>
                {state.isEditing ? (
                  <DateTimePickerComp
                    name="DOB"
                    id="DOB"
                    value={formattedDOB}
                    selected={state.DOB}
                    minDate={minDate}
                    maxDate={maxDate}
                    onDateTimeChange={handleChangeDOB}
                    onSelect={handleChangeDOB}
                    clearable={true}
                    readOnly={!state.isEditing}
                    className={!state.isEditing ? "readonly-input" : ""}
                  />
                ) : (
                  <Input
                    type="text"
                    name="DOB"
                    id="DOB"
                    value={formattedDOB}
                    readOnly
                    className="readonly-input"
                  />
                )}
                {state.isEditing && (
                  <small className="text-muted">
                    Date must be between {minDate.format("DD-MM-YYYY")} and{" "}
                    {maxDate.format("DD-MM-YYYY")}
                  </small>
                )}
              </FormGroup>

              <FormGroup>
                <Label for="pin">PIN</Label>
                <div className="pin-input-wrapper">
                  <Input
                    type={state.isPinVisible ? "text" : "password"}
                    name="pin"
                    id="pin"
                    value={state.pin}
                    onChange={handleChange}
                    readOnly={!state.isEditing}
                    className={!state.isEditing ? "readonly-input" : ""}
                  />
                  <button
                    type="button"
                    onClick={togglePinVisibility}
                    className="pin-toggle-btn"
                  >
                    <i
                      className={`fa ${
                        state.isPinVisible ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </FormGroup>

              {/* Biometric Passkey Section */}
              <FormGroup>
                <Label>Biometric Passkey</Label>
                <div className="biometric-section">
                  {!state.isEditing ? (
                    <div className="biometric-status">
                      <div className="biometric-info">
                        <i
                          className={`fa ${
                            state.biometricEnabled
                              ? "fa-check-circle text-success"
                              : "fa-times-circle text-muted"
                          }`}
                        ></i>
                        <span className="biometric-text">
                          {state.biometricEnabled
                            ? `${
                                state.biometricType === "faceid"
                                  ? "Face ID"
                                  : "Fingerprint"
                              } enabled`
                            : "No biometric passkey set up"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="biometric-setup">
                      {!state.isSettingUpBiometric ? (
                        <div className="biometric-options">
                          <Row>
                            <Col md={6}>
                              <div
                                className={`biometric-option ${
                                  state.biometricType === "faceid"
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleBiometricTypeChange("faceid")
                                }
                              >
                                <i className="fa fa-camera"></i>
                                <span>Face ID</span>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div
                                className={`biometric-option ${
                                  state.biometricType === "fingerprint"
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleBiometricTypeChange("fingerprint")
                                }
                              >
                                <i className="fa fa-fingerprint"></i>
                                <span>Fingerprint</span>
                              </div>
                            </Col>
                          </Row>

                          {state.biometricType !== "none" && (
                            <div className="biometric-actions mt-3">
                              {state.biometricEnabled ? (
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={handleBiometricRemoval}
                                >
                                  <i className="fa fa-trash"></i> Remove
                                  Biometric
                                </Button>
                              ) : (
                                <Button
                                  color="primary"
                                  size="sm"
                                  onClick={handleBiometricSetup}
                                >
                                  <i className="fa fa-plus"></i> Set Up{" "}
                                  {state.biometricType === "faceid"
                                    ? "Face ID"
                                    : "Fingerprint"}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="biometric-enrollment">
                          <div className="enrollment-status">
                            <i className="fa fa-spinner fa-spin text-primary"></i>
                            <p>
                              Setting up{" "}
                              {state.biometricType === "faceid"
                                ? "Face ID"
                                : "Fingerprint"}
                              ...
                            </p>
                            <p className="text-muted small">
                              Please follow your device's prompts to complete
                              the setup
                            </p>
                          </div>
                          <div className="enrollment-actions mt-3">
                            <Button
                              color="success"
                              size="sm"
                              onClick={handleBiometricEnrollment}
                            >
                              <i className="fa fa-check"></i> Complete Setup
                            </Button>
                            <Button
                              color="secondary"
                              size="sm"
                              onClick={() =>
                                setState((prev) => ({
                                  ...prev,
                                  isSettingUpBiometric: false,
                                }))
                              }
                              className="ml-2"
                            >
                              <i className="fa fa-times"></i> Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </FormGroup>
            </div>
          </CardBody>
        </Card>
        {/* Fixed footer bar */}
        <div className={`fixed-footer-bar ${state.isEditing ? "editing" : ""}`}>
          {state.isEditing ? (
            <>
              <Button className="btn-primary-custom" onClick={handleSave}>
                Save Changes
              </Button>
              <Button className="btn-error-custom" onClick={handleLogout}>
                <i className="fa fa-sign-out-alt"></i> Logout
              </Button>
            </>
          ) : (
            <Button className="btn-error-custom" onClick={handleLogout}>
              <i className="fa fa-sign-out-alt"></i> Logout
            </Button>
          )}
        </div>
      </Container>
    </>
  );
}

export default Profile;
