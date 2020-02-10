/* eslint-disable camelcase,react/no-deprecated,no-shadow */
import React from "react";
import {Alert, Platform, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {connect} from "react-redux";
import SelectInput from "react-native-select-input-ios";
import DatePicker from "react-native-datepicker";
import PropTypes from "prop-types";

import {Input} from "../../components/common";
import {registerUser} from "../../actions/Profile";
import {translateText} from "../../translation/translate";
import config from "../../../config/config";
import {BorderlessButton, DefaultButton} from "../../components/buttons";

const CountryViaJSON = require("../../../assets/json/countries.json");
const AreasViaJSON = require("../../../assets/json/areas.json");
const jobsViaJSON = require("../../../assets/json/industries.json");

const email_filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

class Register extends React.Component {
    static navigationOptions = () => {
        return {
            title: translateText("Register").toUpperCase(),
            headerRight: null
        }
    };

    state = {
        name: "",
        name_error: false,
        lastname: "",
        lastname_error: false,
        email: "",
        email_error: false,
        password: "",
        password_error: false,
        password_again: "",
        password_again_error: false,
        gender: "",
        birthdate: "",
        country: "",
        countryList: [],
        areas: [],
        area: "",
        city: "",
        cities: [],
        address: "",
        industries: [
            {value: "", label: translateText("select_industry")},
            {value: "Employed", label: "Employed"}, {
                value: "Student",
                label: "Student"
            }, {
                value: "Retired/Unemployed",
                label: "Retired/Unemployed"
            }],
        industry: "",
        phone: "",
        phone_error: false,
        job: "",
        jobs: [],
        type: false,
        social_token: "",
        raw: ""
    };

    componentWillMount() {
        let countries = CountryViaJSON.map((country) => {
            return {value: country, label: country};
        });

        countries.unshift({value: "", label: translateText("select_country")});

        this.setState({
            countryList: countries
        });

        let areas = AreasViaJSON.map((area) => {
            return {value: area.area, label: area.area, cities: area.cities};
        });

        areas.unshift({value: "", label: translateText("select_area")});

        this.setState({
            areas: areas,
            cities: areas[0].cities ? areas[0].cities.map((city) => {
                return {value: city, label: city};
            }) : []
        });

        this.setState({
            jobs: jobsViaJSON.map((job) => {
                return {value: job, label: job};
            })
        });

        if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.user) {
            const {user} = this.props.navigation.state.params;

            this.setState({
                "email": user.email,
                "type": "facebook",
                "social_token": user.social_token,
                "name": user.first_name,
                "lastname": user.last_name,
                "gender": user.gender,
                "raw": {
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "gender": user.gender,
                    "id": user.id,
                    "image": user.cover && user.cover.source ? user.cover.source : "",
                    "link": user.link
                }
            });
        }
    }

    validateData = (data) => {
        let name_error = false,
            lastname_error = false,
            email_error = false,
            phone_error = false,
            password_error = false,
            password_again_error = false,
            errorText = "";

        if (data.name === "") {
            name_error = true;
            errorText = translateText("empty_value");
        }
        if (data.surname === "") {
            lastname_error = true;
            errorText = translateText("empty_value");
        }
        if (!email_filter.test(data.email)) {
            email_error = true;
            if (errorText === "") {
                errorText = translateText("email_not_valid");
            }
        }
        if (data.phone.length !== 11 || data.phone.indexOf("01") === -1 || data.phone.indexOf("01") !== 0) {
            phone_error = true;
            errorText = translateText("empty_value");
        }
        if (data.password === "") {
            password_error = true;
            errorText = translateText("empty_value");
        }
        if (data.password_again === "" || data.password !== data.password_again) {
            password_again_error = true;
            if (errorText === "") {
                errorText = translateText("passwords_not_match");
            }
        }

        if (errorText !== "") {
            Alert.alert(translateText("error"), errorText);
        }

        this.setState({
            name_error,
            lastname_error,
            email_error,
            phone_error,
            password_error,
            password_again_error
        });

        this.scroll.scrollTo({x: 0, y: 0, animated: true});

        return !(name_error || lastname_error || email_error || phone_error || password_again_error || password_error);
    };

    render() {

        const {
            name, name_error, lastname, lastname_error, email, email_error, birthdate, gender, phone, phone_error, password, password_error, password_again, password_again_error, country, area, city, areas, countryList, cities, address, industries, industry, jobs, job, company, position, type, social_token, raw
        } = this.state;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView} ref={(ref) => {
                    this.scroll = ref;
                }}>
                    <View style={styles.SectionStyle}>
                        <Input placeholder={`${translateText("Name")} *`}
                               value={name}
                               error={name_error}
                               style={styles.defaultInputStyle}
                               onChangeText={(name) => {
                                   this.setState({name});
                               }}/>
                    </View>
                    <View style={styles.SectionStyle}>
                        <Input placeholder={`${translateText("Surname")} *`}
                               value={lastname}
                               error={lastname_error}
                               style={styles.defaultInputStyle}
                               onChangeText={(lastname) => {
                                   this.setState({lastname});
                               }}/>
                    </View>
                    <View style={styles.SectionStyle}>
                        <Input placeholder={`${translateText("E-Mail")} *`}
                               value={email}
                               error={email_error}
                               keyboardType={"email-address"}
                               style={styles.defaultInputStyle}
                               onChangeText={(email) => {
                                   this.setState({email});
                               }}/>
                    </View>
                    <View style={styles.SectionStyle}>
                        <DatePicker
                            style={{width: "100%"}}
                            date={birthdate}
                            mode="date"
                            format="DD/MM/YYYY"
                            minDate="01/01/1920"
                            showIcon={false}
                            placeholder={`${translateText("Birthdate")}`}
                            confirmBtnText={translateText("Confirm")}
                            cancelBtnText={translateText("Cancel")}
                            customStyles={{
                                dateInput: [styles.defaultInputStyle, {
                                    alignItems: "flex-start"
                                }],
                                placeholderText: {
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    color: "#000",
                                    fontSize: 15
                                },
                                dateText: {
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    color: "#000",
                                    fontSize: 15
                                },
                                btnTextConfirm: {
                                    color: "#46cf98"
                                },
                                btnTextCancel: {
                                    color: "#46cf98"
                                }
                            }}
                            onDateChange={(birthdate) => {
                                this.setState({birthdate: birthdate});
                            }}/>
                    </View>
                    <View style={styles.SectionStyle}>
                        <SelectInput
                            value={gender}
                            keyboardBackgroundColor={"#fff"}
                            buttonsBackgroundColor={"#fff"}
                            buttonsTextColor={"#46cf98"}
                            buttonsTextSize={14}
                            labelStyle={styles.inputStyle}
                            options={[
                                {value: "", label: translateText("select_gender")},
                                {value: "male", label: translateText("Male")},
                                {value: "female", label: translateText("Female")}
                            ]}
                            onSubmitEditing={(itemValue) => {
                                this.setState({gender: itemValue});
                            }}
                            style={[styles.defaultInputStyle, Platform.OS === "ios" ? {
                                padding: 10,
                                alignItems: "flex-start"
                            } : {padding: 0}]}
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        <Input placeholder={`${translateText("Phone")} *`}
                               value={phone}
                               keyboardType={"numeric"}
                               error={phone_error}
                               style={styles.defaultInputStyle}
                               onChangeText={(phone) => {
                                   if (phone && phone.length > 11) {
                                       phone = phone.substring(0, 10);
                                   }

                                   this.setState({phone});
                               }}/>
                        <Text style={styles.helpText}>{translateText("hint_mobile_number")}</Text>
                    </View>
                    {!type && <View style={styles.SectionStyle}>
                        <Input secureTextEntry
                               placeholder={`${translateText("Password")} *`}
                               style={styles.defaultInputStyle}
                               error={password_error}
                               value={password}
                               onChangeText={(password) => {
                                   this.setState({password});
                               }}/>
                    </View>}
                    {!type && <View style={styles.SectionStyle}>
                        <Input secureTextEntry
                               style={styles.defaultInputStyle}
                               error={password_again_error}
                               placeholder={`${translateText("Password Again")} *`}
                               value={password_again}
                               onChangeText={(password_again) => {
                                   this.setState({password_again});
                               }}/>
                    </View>}

                    <View style={[styles.SectionStyle, {paddingTop: 15, paddingBottom: 15, alignItems: "center"}]}>
                        <Text>{translateText("required_field_hints")}</Text>
                        <View style={styles.horizontalLine}/>
                        <Text>{translateText("optional_field_hints")}</Text>
                    </View>

                    <View style={styles.SectionStyle}>
                        <SelectInput
                            value={country}
                            keyboardBackgroundColor={"#fff"}
                            buttonsBackgroundColor={"#fff"}
                            buttonsTextColor={"#46cf98"}
                            buttonsTextSize={14}

                            labelStyle={styles.inputStyle}
                            options={countryList}
                            onSubmitEditing={(itemValue) => {
                                this.setState({country: itemValue, area: "", city: ""});
                            }}
                            style={[styles.defaultInputStyle, Platform.OS === "ios" ? {
                                padding: 10,
                                alignItems: "flex-start"
                            } : {padding: 0}]}
                        />
                    </View>
                    {country === "Egypt" && areas.length !== 0 && <View style={styles.SectionStyle}>
                        <SelectInput
                            value={area}
                            keyboardBackgroundColor={"#fff"}
                            buttonsBackgroundColor={"#fff"}
                            buttonsTextColor={"#46cf98"}
                            buttonsTextSize={14}

                            labelStyle={styles.inputStyle}
                            options={areas}
                            onSubmitEditing={(itemValue) => {
                                const filteredAreas = areas.filter((ar) => {
                                    return ar.value === itemValue;
                                })[0];

                                this.setState({
                                    area: itemValue,
                                    cities: filteredAreas.cities ? filteredAreas.cities.map((city) => {
                                        return {value: city, label: city};
                                    }) : [],
                                    city: filteredAreas.cities ? filteredAreas.cities[0] : ""
                                });
                            }}
                            style={[styles.defaultInputStyle, Platform.OS === "ios" ? {
                                padding: 10,
                                alignItems: "flex-start"
                            } : {padding: 0}]}
                        />
                    </View>}

                    {country === "Egypt" && areas.length !== 0 && cities.length !== 0 && area !== "" &&
                    <View style={styles.SectionStyle}>
                        <SelectInput
                            value={city}
                            keyboardBackgroundColor={"#fff"}
                            buttonsBackgroundColor={"#fff"}
                            buttonsTextColor={"#46cf98"}
                            buttonsTextSize={14}

                            labelStyle={styles.inputStyle}
                            options={cities}
                            onSubmitEditing={(itemValue) => {
                                this.setState({city: itemValue});
                            }}
                            style={[styles.defaultInputStyle, Platform.OS === "ios" ? {
                                padding: 10,
                                alignItems: "flex-start"
                            } : {padding: 0}]}
                        />
                    </View>}

                    <View style={styles.SectionStyle}>
                        <TextInput multiline={true}
                                   placeholder={translateText("Address")}
                                   numberOfLines={3}
                                   underlineColorAndroid='rgba(0,0,0,0)'
                                   value={address}
                                   style={[styles.defaultInputStyle, {
                                       height: 100,
                                       padding: 15,
                                       textAlign: "left",
                                       textAlignVertical: "top"
                                   }]}
                                   onChangeText={(address) => {
                                       this.setState({address});
                                   }}/>
                    </View>

                    <View style={styles.SectionStyle}>
                        <SelectInput
                            value={industry}
                            keyboardBackgroundColor={"#fff"}
                            buttonsBackgroundColor={"#fff"}
                            buttonsTextColor={"#46cf98"}
                            buttonsTextSize={14}

                            labelStyle={styles.inputStyle}
                            options={industries}
                            onSubmitEditing={(itemValue) => {
                                this.setState({job: "", industry: itemValue, company: "", position: ""});
                            }}
                            style={[styles.defaultInputStyle, Platform.OS === "ios" ? {
                                padding: 10
                            } : {padding: 0}]}
                        />
                    </View>

                    {industry === "Employed" && <View style={styles.SectionStyle}>
                        <SelectInput
                            value={job}
                            keyboardBackgroundColor={"#fff"}
                            buttonsBackgroundColor={"#fff"}
                            buttonsTextColor={"#46cf98"}
                            buttonsTextSize={14}
                            labelStyle={styles.inputStyle}
                            options={jobs}
                            onSubmitEditing={(itemValue) => {
                                this.setState({job: itemValue});
                            }}
                            style={[styles.defaultInputStyle, Platform.OS === "ios" ? {
                                padding: 10
                            } : {padding: 0}]}
                        />
                    </View>}
                    {industry === "Employed" && <View style={styles.SectionStyle}>
                        <Input placeholder={`${translateText("Company")} *`}
                               style={styles.defaultInputStyle}
                               value={company}
                               onChangeText={(company) => {
                                   this.setState({company});
                               }}/>
                    </View>}

                    {industry === "Employed" && <View style={styles.SectionStyle}>
                        <Input placeholder={`${translateText("Position")} *`}
                               style={styles.defaultInputStyle}
                               value={position}
                               onChangeText={(position) => {
                                   this.setState({position});
                               }}/>
                    </View>}

                    <View style={styles.cardContainer}>
                        <View style={styles.buttonContainer}>
                            <BorderlessButton
                                title={type === "facebook" ? translateText("Save") : translateText("Register")}
                                style={styles.defaultButtonStyle}
                                onPress={() => {
                                    const registerData = {
                                        name,
                                        "surname": lastname,
                                        gender,
                                        birthdate,
                                        email,
                                        phone,
                                        address,
                                        city,
                                        country,
                                        area,
                                        status: industry,
                                        company,
                                        position,
                                        industry: job
                                    };

                                    if (type === "facebook") {
                                        registerData["social_token"] = social_token;
                                        registerData["raw"] = raw;
                                        registerData["isfacebook"] = true;
                                    }
                                    else {
                                        registerData["password"] = password;
                                        registerData["password_again"] = password_again;
                                    }

                                    if (this.validateData(registerData) && !this.props.loading) {
                                        this.props.registerUser(registerData);
                                    }

                                }}/>
                        </View>

                        <DefaultButton title={translateText("Privacy")}
                                       titleStyle={styles.borderlessButton}
                                       style={{backgroundColor: "transparent"}}
                                       onPress={() => {
                                           this.props.navigation.navigate(
                                               "TermAndConditions", {
                                                   "mall": this.props.mall
                                               }
                                           );
                                       }}/>

                    </View>

                </ScrollView>
            </View>
        );
    }
}

const styles = {
    horizontalLine: {
        width: "100%",
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#e5e5e5"
    },
    inputStyle: {
        color: "#000",
        marginRight: 10,
        marginLeft: 10
    },
    defaultInputStyle: {
        backgroundColor: "#fff",
        borderColor: "#555",
        width: "100%",
        height: 40,
        borderWidth: 1,
        padding: 8,
        justifyContent: "center"
    },
    buttonContainer: {
        marginTop: 15,
        width: "70%"
    },
    cardContainer: {
        marginBottom: 30,
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    defaultButtonStyle: {
        width: "100%",
        height: 40,
        backgroundColor: config().BASE_SECOND_COLOR,
        justifyContent: "center"
    },
    borderlessButton: {
        color: config().BASE_SECOND_COLOR
    },
    scrollView: {
        padding: 15
    },
    backgroundImage: {
        backgroundColor: "#ccc",
        resizeMode: "cover",
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center"
    },
    SectionStyle: {
        marginTop: 10
    },
    container: {
        flex: 1
    },
    helpText: {
        fontSize: 12,
        color: config().BASE_SECOND_COLOR,
        fontStyle: "italic",
        fontWeight: "100"
    }
};
const mapStateToProps = ({auth, main}) => {
    const {error, loading} = auth;
    const {payload} = main;
    return {error, loading, mall: payload.mall};
};

Register.propTypes = {
    registerUser: PropTypes.func,
    navigation: PropTypes.instanceOf(Object),
    mall: PropTypes.instanceOf(Object)
};

const RegisterRedux = connect(mapStateToProps, {
    registerUser
})(Register);

export {RegisterRedux as Register};
