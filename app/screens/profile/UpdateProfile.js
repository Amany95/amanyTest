import React, {Component} from 'react';
import {connect} from "react-redux";
import {Platform, ScrollView, Text, TextInput, View} from "react-native";

import {Input} from "../../components/common";
import {updateUser} from "../../actions/Profile";
import {translateText} from "../../translation/translate";
import config from "../../../config/config";
import DatePicker from "react-native-datepicker";
import {BorderlessButton, DefaultButton} from "../../components/buttons";
import SelectInput from "react-native-select-input-ios";

const CountryViaJSON = require('../../../assets/json/countries.json');
const AreasViaJSON = require('../../../assets/json/areas.json');
const jobsViaJSON = require('../../../assets/json/industries.json');

class UpdateProfile extends Component {
    static navigationOptions = () => ({
            title: translateText('UpdateProfile').toUpperCase(),
            headerRight: null
        }
    );

    state = {
        name: this.props.user.name,
        lastname: this.props.user.surname,
        email: this.props.user.email,
        gender: this.props.user.gender,
        phone: this.props.user.phone,
        birthday: this.props.user.birthdate,
        country: this.props.user.country,
        countryList: [],
        areas: [],
        area: this.props.user.area,
        city: this.props.user.city,
        cities: [],
        address: this.props.user.address,
        industry: this.props.user.industry,
        status: this.props.user.status,
        jobs: [],
        company: this.props.user.company,
        position: this.props.user.position,
        industries: [
            {value: '', label: 'Select an industry...'},
            {value: 'Employed', label: 'Employed'}, {
                value: 'Student',
                label: 'Student'
            }, {
                value: 'Retired/Unemployed',
                label: 'Retired/Unemployed'
            }],
    };


    componentDidMount() {
        let countries = CountryViaJSON.map((country) => {
            return {value: country, label: country}
        });

        countries.unshift({value: '', label: 'Select a Country...'})

        this.setState({
            countryList: countries
        })

        let areas = AreasViaJSON.map((area) => {
            return {value: area.area, label: area.area, cities: area.cities}
        });


        areas.unshift({value: '', label: 'Select an Area...'});

        this.setState({
            areas: areas,
            cities: areas[0].cities ? areas[0].cities.map((city) => {
                return {value: city, label: city}
            }) : []
        })

        this.setState({
            jobs: jobsViaJSON.map((job) => {
                return {value: job, label: job}
            })
        })

    }

    render() {

        const {
            name, lastname, email, birthday, gender, phone, country, area, city, areas, countryList, cities, address, industries, industry, jobs, status, company, position
        } = this.state;


        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.SectionStyle}>
                        <Input placeholder={translateText('Name') + ' *'}
                               value={name}
                               style={styles.defaultInputStyle}
                               onChangeText={name => this.setState({name})}/>
                    </View>
                    <View style={styles.SectionStyle}>
                        <Input placeholder={translateText("Surname") + ' *'}
                               value={lastname}
                               style={styles.defaultInputStyle}
                               onChangeText={lastname => {
                                   this.setState({lastname})
                               }}/>
                    </View>
                    <View style={styles.SectionStyle}>
                        <Input placeholder={translateText("E-Mail") + ' *'}
                               value={email}
                               keyboardType={'email-address'}

                               style={styles.defaultInputStyle}
                               onChangeText={email => {
                                   this.setState({email})
                               }}/>
                    </View>
                    <View style={styles.SectionStyle}>
                        <DatePicker
                            style={{width: '100%',}}
                            date={birthday}
                            mode="date"
                            format="DD-MM-YYYY"
                            minDate="01-01-1920"
                            showIcon={false}
                            placeholder={translateText("Birthdate") + ' *'}
                            confirmBtnText={translateText("Confirm")}
                            cancelBtnText={translateText("Cancel")}
                            customStyles={{
                                dateInput: [styles.defaultInputStyle, {alignItems: 'flex-start'}],
                                placeholderText: {
                                    right: -10,
                                    color: '#000'
                                },
                                dateText: {
                                    right: -10,
                                },
                                btnTextConfirm: {
                                    color: '#46cf98'
                                },
                                btnTextCancel: {
                                    color: '#46cf98'
                                },
                            }}
                            onDateChange={(birthday) => {
                                this.setState({birthday: birthday});
                            }}/>
                    </View>
                    <View style={styles.SectionStyle}>
                        <SelectInput
                            value={gender}
                            keyboardBackgroundColor={'#fff'}
                            buttonsBackgroundColor={'#fff'}
                            buttonsTextColor={'#46cf98'}
                            buttonsTextSize={16}

                            labelStyle={styles.inputStyle}
                            options={[
                                {value: 'male', label: translateText('Male')},
                                {value: 'female', label: translateText('Female')},
                            ]}
                            onSubmitEditing={(itemValue) => this.setState({gender: itemValue})}
                            style={[styles.defaultInputStyle, Platform.OS === 'ios' ? {
                                padding: 10,
                                alignItems: 'flex-start',
                            } : {padding: 0}]}
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        <Input placeholder={translateText("Phone") + ' *'}
                               value={phone}
                               keyboardType={'numeric'}
                               style={styles.defaultInputStyle}
                               onChangeText={phone => {
                                   this.setState({phone})
                               }}/>
                        <Text style={styles.helpText}>Phone number should be 11 digits and it should start with
                            01</Text>
                    </View>
                    <View style={styles.SectionStyle}>
                        <SelectInput
                            value={country}
                            keyboardBackgroundColor={'#fff'}
                            buttonsBackgroundColor={'#fff'}
                            buttonsTextColor={'#46cf98'}
                            buttonsTextSize={16}

                            labelStyle={styles.inputStyle}
                            options={countryList}
                            onSubmitEditing={(itemValue) => {
                                this.setState({country: itemValue, area: '', city: ''})
                            }}
                            style={[styles.defaultInputStyle, Platform.OS === 'ios' ? {
                                padding: 10,
                                alignItems: 'flex-start',
                            } : {padding: 0}]}
                        />
                    </View>
                    {country === 'Egypt' && areas.length !== 0 && <View style={styles.SectionStyle}>
                        <SelectInput
                            value={area}
                            keyboardBackgroundColor={'#fff'}
                            buttonsBackgroundColor={'#fff'}
                            buttonsTextColor={'#46cf98'}
                            buttonsTextSize={16}

                            labelStyle={styles.inputStyle}
                            options={areas}
                            onSubmitEditing={(itemValue) => {
                                const filteredAreas = areas.filter((ar) => ar.value === itemValue)[0];

                                this.setState({
                                    area: itemValue,
                                    cities: filteredAreas.cities ? filteredAreas.cities.map((city) => {
                                        return {value: city, label: city}
                                    }) : [],
                                    city: filteredAreas.cities ? filteredAreas.cities[0] : ''
                                });
                            }}
                            style={[styles.defaultInputStyle, Platform.OS === 'ios' ? {
                                padding: 10,
                                alignItems: 'flex-start',
                            } : {padding: 0}]}
                        />
                    </View>}

                    {country === 'Egypt' && areas.length !== 0 && cities.length !== 0 && area !== '' &&
                    <View style={styles.SectionStyle}>
                        <SelectInput
                            value={city}
                            keyboardBackgroundColor={'#fff'}
                            buttonsBackgroundColor={'#fff'}
                            buttonsTextColor={'#46cf98'}
                            buttonsTextSize={16}

                            labelStyle={styles.inputStyle}
                            options={cities}
                            onSubmitEditing={(itemValue) => {
                                this.setState({city: itemValue})
                            }}
                            style={[styles.defaultInputStyle, Platform.OS === 'ios' ? {
                                padding: 10,
                                alignItems: 'flex-start',
                            } : {padding: 0}]}
                        />
                    </View>}

                    <View style={styles.SectionStyle}>
                        <TextInput multiline={true}
                                   placeholder={translateText('Address')}
                                   numberOfLines={3}
                                   underlineColorAndroid='rgba(0,0,0,0)'
                                   value={address}
                                   style={[styles.defaultInputStyle, {
                                       height: 100,
                                       padding: 15,
                                       textAlign: 'left',
                                       textAlignVertical: "top"
                                   }]}
                                   onChangeText={address => {
                                       this.setState({address})
                                   }}/>
                    </View>

                    <View style={styles.SectionStyle}>
                        <SelectInput
                            value={status}
                            keyboardBackgroundColor={'#fff'}
                            buttonsBackgroundColor={'#fff'}
                            buttonsTextColor={'#46cf98'}
                            buttonsTextSize={16}

                            labelStyle={styles.inputStyle}
                            options={industries}
                            onSubmitEditing={(itemValue) => {
                                this.setState({industry: '', status: itemValue, company: '', position: ''})
                            }}
                            style={[styles.defaultInputStyle, Platform.OS === 'ios' ? {
                                padding: 10,
                            } : {padding: 0}]}
                        />
                    </View>

                    {status === 'Employed' && <View style={styles.SectionStyle}>
                        <SelectInput
                            value={industry}
                            keyboardBackgroundColor={'#fff'}
                            buttonsBackgroundColor={'#fff'}
                            buttonsTextColor={'#46cf98'}
                            buttonsTextSize={16}
                            labelStyle={styles.inputStyle}
                            options={jobs}
                            onSubmitEditing={(itemValue) => {
                                this.setState({industry: itemValue})
                            }}
                            style={[styles.defaultInputStyle, Platform.OS === 'ios' ? {
                                padding: 10,
                            } : {padding: 0}]}
                        />
                    </View>}
                    {status === 'Employed' && <View style={styles.SectionStyle}>
                        <Input placeholder={translateText("Company") + ' *'}
                               style={styles.defaultInputStyle}
                               value={company}
                               onChangeText={company => {
                                   this.setState({company})
                               }}/>
                    </View>}

                    {status === 'Employed' && <View style={styles.SectionStyle}>
                        <Input placeholder={translateText("Position") + ' *'}
                               style={styles.defaultInputStyle}
                               value={position}
                               onChangeText={position => {
                                   this.setState({position})
                               }}/>
                    </View>}

                    <View style={styles.cardContainer}>
                        <View style={styles.buttonContainer}>
                            <BorderlessButton
                                title={translateText('Save')}
                                style={styles.defaultButtonStyle}
                                onPress={() => {
                                    const registerData = {
                                        name,
                                        'surname': lastname,
                                        gender,
                                        "birthdate": birthday.replace(/-/g, '/'),
                                        email,
                                        phone,
                                        address,
                                        city,
                                        country,
                                        area,
                                        status,
                                        company,
                                        position,
                                        industry,
                                    };

                                    this.props.updateUser(registerData, this.props.user);
                                }}/>
                        </View>

                        <DefaultButton title={translateText('Privacy')}
                                       titleStyle={styles.borderlessButton}
                                       style={{backgroundColor: 'transparent'}}
                                       onPress={() => {
                                           this.props.navigation.navigate(
                                               'TermAndConditions', {
                                                   'mall': this.props.mall
                                               }
                                           )
                                       }}/>

                    </View>

                </ScrollView>
            </View>
        );
    }
}

const styles = {
    inputStyle: {
        color: '#555',
        marginRight: 10,
        marginLeft: 10,
    },
    defaultInputStyle: {
        backgroundColor: '#fff',
        borderColor: '#555',
        width: '100%',
        height: 40,
        borderWidth: 1,
        padding: 8,
        justifyContent: 'center',
    },
    buttonContainer: {
        marginTop: 15,
        width: '70%'
    },
    cardContainer: {
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    defaultButtonStyle: {
        width: '100%',
        height: 40,
        backgroundColor: config().BASE_SECOND_COLOR
    },
    borderlessButton: {
        color: config().BASE_SECOND_COLOR
    },
    scrollView: {
        padding: 15
    },
    backgroundImage: {
        backgroundColor: '#ccc',
        resizeMode: 'cover',
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
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
        fontStyle: 'italic',
        fontWeight: '100'
    }
};

const mapStateToProps = ({auth, main}) => {
    return {mall: main.payload.mall, user: auth.user};
};

const UpdateProfileRedux = connect(mapStateToProps, {
    updateUser, withRef: true
})(UpdateProfile);

export {UpdateProfileRedux as UpdateProfile}
