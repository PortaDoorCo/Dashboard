import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import truck from '../../../../assets/icon/truck.png'
import delivery from '../../../../assets/icon/delivery.png'
const socket = io('https://server.portadoor.com/');




const Drivers = (props: any) => {
    const { color, name, id } = props;
    return (
        <div className="truck" title="Delivery Truck">
            <img src={truck}></img>
            <div className="pulse" />
        </div>
        // <div className="marker"
        //     style={{ backgroundColor: color, cursor: 'pointer' }}
        //     title={name}
        // />
    );
};

const Deliveries = (props: any) => {
    const { color, name, id } = props;
    return (
        <div className="marker" title="Delivery Truck">
            <img src={delivery}></img>
            {/* <div className="pulse" /> */}
        </div>
    );
};

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            driverLocations: []
        }
    }

    componentDidMount() {

        socket.emit('position', {
            coords: {
                latitude: 41.3705498,
                longitude: -73.2105237
            }
        })

        socket.on('drivers', res =>
            this.setState({
                driverLocations: res
            })
        )
    }


    static defaultProps = {
        center: {
            lat: 41.3879115,
            lng: -73.0502929
        },
        zoom: 8
    };

    render() {
        const { driverLocations } = this.state;
        const { deliveries } = this.props;
        console.log(driverLocations)
        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '100%', width: '100%' }}>
                <h3>Deliveries</h3>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyB_JC10u6MVdITB1FhLhCJGNu_qQ8kJyFE' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                >
                    {this.state.driverLocations.map(i => {
                        return (
                            <Drivers
                                lat={i.coords.latitude}
                                lng={i.coords.longitude}
                                name="Driver"
                                color="red"
                            />
                        )
                    })}

                    {deliveries.map(i => {
                        return (
                            <Deliveries
                                lat={i.location.latitude}
                                lng={i.location.longitude}
                                name="Delivery"
                                color="blue"
                            />
                        )
                    })}


                </GoogleMapReact>
            </div>
        );
    }
}

const mapStateToProps = (state, prop) => ({
    deliveries: state.Orders.deliveries
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {

        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);