# DataStax Desktop - Node.js Netflix example

An introduction to using the Cassandra database with well-defined steps to optimize your learning. Using a Netflix dataset for sample data, your locally running Cassandra database will contain a minimal set of show data for you to customize and experiment with.

Contributors:
* [Jeff Banks](https://github.com/jeffbanks)
* [Chris Splinter](https://github.com/csplinter)

## Objectives
* Leverage DataStax driver APIs for interaction with a local running Cassandra database.
* Set up a Cassandra Query Language (CQL) session and perform operations such as creating, reading, and writing.
* Use the Netflix show dataset as example information across three differently constructed tables.
* Observe how the partition key along with clustering keys produce an optimized experience.
* Have fun!

## Project Layout

* [app.js](app.js) - main application file
* [netflix-shows](netflix-shows.cql) - foundation CQL for reference or use

## How this works
To get started, read through the comments in the `app.js` to familiarize yourself with the steps for interacting with your own Cassandra database. The functions invoked by the `app.js` are created to provide more flexibility for modifications as you learn.

## Setup and running

### Prerequisites
If using [DataStax Desktop](https://www.datastax.com/blog/2020/05/learn-cassandra-datastax-desktop), no prerequisites will be required. The Cassandra instance is provided with the DataStax Desktop stack as part of container provisioning.

If NOT using DataStax Desktop, spin up your own local instance of Cassandra exposing its address and port to align with the settings in the **app.js** file.  You will need to install and perform the following steps:

  * Install [Apache Cassandra®](http://cassandra.apache.org/download/) 3.x
  * [Node.js](https://nodejs.org/en/download/) server environment
  * Use npm to install the driver: `npm install cassandra-driver`
  * Create the keyspace and table.  The `netflix-shows.cql` file provides the schema used for this project.


All of the connection code is contained in the `app.js` file.  The `cassandra.Client()` API is used to connect to your instance of Cassandra.

```javascipt
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'dc1',
  keyspace: 'demo'
});
```

## Running

Simply kickoff the app from the command line.

> node app.js

### Console output
```
Connecting - step 1
Creating a keyspace - step 2
Creating Keyspace: demo
Creating tables - step 3
Creating Primary Table
Creating Titles By Date Table
Creating Titles By Rating Table
Inserting records - step 4
Inserting into Primary Table for title: Life of Jimmy
Inserting into Primary Table for title: Pulp Fiction
Inserting into TitlesByDate Table for title: Life of Jimmy
Inserting into TitlesByDate Table for title: Pulp Fiction
Inserting into TitlesByRating Table for title: Life of Jimmy
Inserting into TitlesByRating Table for title: Pulp Fiction
Reading records - step 5
Selecting all from Table: netflix_master
Rows in result: 2
Row {
  title: 'Life of Jimmy',
  show_id: 100000000,
  cast: [ 'Jimmy' ],
  country: [ 'United States' ],
  date_added: LocalDate {
    date: 2020-07-01T00:00:00.000Z,
    _value: null,
    year: 2020,
    month: 7,
    day: 1
  },
  description: 'Experiences of a guitar playing DataStax developer',
  director: [ 'Franky J' ],
  duration: '42 min',
  listed_in: [ 'Action' ],
  rating: 'TV-18',
  release_year: 2020,
  type: 'Movie'
}
Row {
  title: 'Pulp Fiction',
  show_id: 100000001,
  cast: [
    'John Travolta',
    'Samuel L. Jackson',
    'Uma Thurman',
    'Harvey Keitel',
    'Tim Roth',
    'Amanda Plummer',
    'Maria de Medeiros',
    'Ving Rhames',
    'Eric Stoltz',
    'Rosanna Arquette',
    'Christopher Walken',
    'Bruce Willis'
  ],
  country: [ 'United States' ],
  date_added: LocalDate {
    date: 2019-02-19T00:00:00.000Z,
    _value: null,
    year: 2019,
    month: 2,
    day: 19
  },
  description: 'This stylized crime caper weaves together stories ...',
  director: [ 'Quentin Tarantino' ],
  duration: '42 min',
  listed_in: [ 'Classic Movies', 'Cult Movies', 'Dramas' ],
  rating: 'R',
  release_year: 1994,
  type: 'Movie'
}
Selecting all from Table: netflix_titles_by_rating
Rows in result: 2
Row { rating: 'TV-18', show_id: 100000000, title: 'Life of Jimmy' }
Row { rating: 'R', show_id: 100000001, title: 'Pulp Fiction' }
Selecting all from Table: netflix_titles_by_date
Rows in result: 2
Row {
  release_year: 2020,
  date_added: LocalDate {
    date: 2020-07-01T00:00:00.000Z,
    _value: null,
    year: 2020,
    month: 7,
    day: 1
  },
  show_id: 100000000,
  title: 'Life of Jimmy',
  type: 'Movie'
}
Row {
  release_year: 1994,
  date_added: LocalDate {
    date: 2019-02-19T00:00:00.000Z,
    _value: null,
    year: 2019,
    month: 2,
    day: 19
  },
  show_id: 100000001,
  title: 'Pulp Fiction',
  type: 'Movie'
}
Selecting all by Title: Pulp Fiction from Primary table
Rows in result: 1
Row { rating: 'R', show_id: 100000001, title: 'Pulp Fiction' }
Selecting all by Title: Life of Jimmy from Primary table
Rows in result: 1
Row { rating: 'TV-18', show_id: 100000000, title: 'Life of Jimmy' }
Updating record with read - step 6
Updating director list by Title: Pulp Fiction and Show ID: 100000001 from Primary table
Selecting director by Title: Pulp Fiction from Primary table
Rows in result: 1
Row { director: [ 'Quentin Jerome Tarantino' ] }
Shutting down client - step 7
```

### Having trouble?
Are you getting errors reported but can't figure out what to do next?  Copy your log output, document any details, and head over to the [DataStax Community](https://community.datastax.com/spaces/131/datastax-desktop.html) to get some assistance.


### Questions or comments?
If you have any questions or want to post a feature request, visit the [Desktop space at DataStax Community](https://community.datastax.com/spaces/131/datastax-desktop.html)

