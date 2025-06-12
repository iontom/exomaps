# Nearby Exo-System Map Application

### Simulating all nearby stellar systems & planemos within 15 Parsecs

![Image of the map](https://raw.githubusercontent.com/iontom/exomaps/master/wiki/STARMAP.png)

### Map of the Neighborhood

The first goal of this project is an attempt to display all objects within 15 parsecs using WebGL, and to make a way to quickly browse information about the system, including planetary systems and binary configuration. Moreover, I intend to use the Titius-Bode law to "fill in the blanks" between known exoplanets, or systems lacking RV or transit data based on known configurations from other similar class stars and star metalicity.

### The Trans-Stellar Economy

The second goal of this project is to build a simple model for infrastructure development, slower-than-light (STL) interstellar vehicles (ISVs), and to create a framework for understaning the inter-relation of various polities, social-classes, artilects and historical figures. Think of it as a hard sci-fi space opera generator. With enough effort, it might even weave in a linguistics model

### General Application Structure

This is a first round build, I anticipate that I may need a 2nd or 3rd build before I'm satisfied (and as exciting things like WebGPU rolloout). However, for now the structure is as follows:

* Docker Compose for a multi-segmented, portable dev app
* SocketIO powered Flask Web App w/ Client ThreeJS (mounted volume for easy dev)
* PostGRES Database w/ Redis for Session Info (WIP)
* An ETL Container for compiling astronomical data & building an up-to-date model

**Future goals include:**

* CI/CD Release Pipeline & hosting somewhere
* Refactor fully to the "FRED" stack for compiling Node packages into WebPack
* Possibly ditching ThreeJS for something more performant using WebAssembly or waiting for WebGPU
* Represent Industrial & Commodity Process Flows + Entity Ownership Networks via GoJS

