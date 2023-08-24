<template>
    <div>
      <div id="map" style="width: 100%; height: 500px;"></div>
      <button @click="toggleSimulation">{{ simulationStarted ? 'Pause' : 'Play' }}</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        simulationStarted: false,
        currentTimestamp: 0,
        departures: [
          // Your departure data goes here
        ],
        // Other data properties
      };
    },
    mounted() {
      setInterval(this.advanceSimulationTime, 1000);
    },
    methods: {
      toggleSimulation() {
        this.simulationStarted = !this.simulationStarted;
        if (this.simulationStarted) {
          this.animateSimulation();
        }
      },
      advanceSimulationTime() {
        if (this.simulationStarted) {
          this.currentTimestamp += 60; // Advance by 1 minute (60 seconds)
        }
      },
      animateSimulation() {
        if (!this.simulationStarted) {
          return;
        }
  
        this.departures.forEach(departure => {
          const event = departure.events.find(event => event.timestamp === this.currentTimestamp);
          if (event) {
            this.startAnimationForVehicle(departure);
          }
        });
  
        requestAnimationFrame(this.animateSimulation);
      },
      startAnimationForVehicle(departure) {
        // Your animation logic goes here
        // Update vehicle marker positions based on event.location
      },
      initializeMap() {
        // Your map initialization logic goes here
      },
      // Other methods
    },
  };
  </script>

Maybe I didn't understand something.. But the startAnimationForVehicle had two arguments, departure and marker. How startAnimationForVehicle is implemented now?

<template>
    <div>
      <div id="map" style="width: 100%; height: 500px;"></div>
      <button @click="toggleSimulation">{{ simulationStarted ? 'Pause' : 'Play' }}</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        simulationStarted: false,
        currentTimestamp: 0,
        departures: [
          // Your departure data goes here
        ],
        // Other data properties
      };
    },
    mounted() {
      setInterval(this.advanceSimulationTime, 1000);
    },
    methods: {
      toggleSimulation() {
        this.simulationStarted = !this.simulationStarted;
        if (this.simulationStarted) {
          this.animateSimulation();
        }
      },
      advanceSimulationTime() {
        if (this.simulationStarted) {
          this.currentTimestamp += 60; // Advance by 1 minute (60 seconds)
        }
      },
      animateSimulation() {
        if (!this.simulationStarted) {
          return;
        }
  
        this.departures.forEach(departure => {
          const event = departure.events.find(event => event.timestamp === this.currentTimestamp);
          if (event) {
            this.startAnimationForVehicle(departure);
          }
        });
  
        requestAnimationFrame(this.animateSimulation);
      },
      startAnimationForVehicle(departure) {
        // Retrieve the marker associated with the departure
        const marker = this.markers[departure.id];
        // Your animation logic goes here
        // Update vehicle marker positions based on event.location
      },
      initializeMap() {
        // Your map initialization logic goes here
      },
      // Other methods
    },
  };
  </script>

initializeMap() {
    // ... Other map initialization code ...
  
    this.departures.forEach(departure => {
      const marker = new mapboxgl.Marker(/* Marker options */).setLngLat(/* Initial coordinates */).addTo(this.map);
      this.markers[departure.id] = marker;
    });
  },

  
  