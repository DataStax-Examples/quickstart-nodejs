const cassandra = require('cassandra-driver')

const TABLE_NETFLIX_PRIMARY = "netflix_master"
const TABLE_NETFLIX_TITLES_BY_DATE = "netflix_titles_by_date"
const TABLE_NETFLIX_TITLES_BY_RATING = "netflix_titles_by_rating"

const TITLE_PULP_FICTION = "Pulp Fiction"
const TITLE_LIFE_OF_JIMMY = "Life of Jimmy"

const SHOW_ID_LIFE_OF_JIMMY = 100000000
const SHOW_ID_PULP_FICTION = 100000001
const KEYSPACE_NAME = "demo"

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datastax-desktop'
})

async function createKeyspace() {
  const createKeyspaceQuery = 'CREATE KEYSPACE IF NOT EXISTS ' +
    KEYSPACE_NAME + ' WITH replication = {\'class\': \'SimpleStrategy\', \'replication_factor\': 1};'

  console.log('Creating Keyspace: %s', KEYSPACE_NAME)
  client.execute(createKeyspaceQuery)
}

async function createPrimaryTable() {

  const createPrimaryTableQuery = 'CREATE TABLE IF NOT EXISTS ' +
    TABLE_NETFLIX_PRIMARY + ' (\
  show_id int, \
  cast list <text>, \
  country list <text>, \
  date_added date, \
  description text, \
  director list <text>, \
  duration text, \
  listed_in list <text>, \
  rating text, \
  release_year int, \
  title text, \
  type text, \
  PRIMARY KEY((title), show_id)); '

  console.log("Creating Primary Table")
  await client.execute(createPrimaryTableQuery)
}

async function createTitlesByDateTable() {

  const createTitlesByDateTableQuery = 'CREATE TABLE IF NOT EXISTS ' +
    TABLE_NETFLIX_TITLES_BY_DATE + ' (show_id int, date_added date, release_year int, title text, type text,\
  PRIMARY KEY((release_year), date_added, show_id)) WITH CLUSTERING ORDER BY(date_added DESC) '

  console.log("Creating Titles By Date Table")
  await client.execute(createTitlesByDateTableQuery)
}

async function createTitlesByRatingTable() {

  const createTitlesByRating = 'CREATE TABLE IF NOT EXISTS ' +
    TABLE_NETFLIX_TITLES_BY_RATING + ' ( show_id int, rating text, title text, PRIMARY KEY((rating), show_id));'

  console.log("Creating Titles By Rating Table")
  await client.execute(createTitlesByRating)
}

async function insertPrimaryRecords() {

  const insertPrimary = 'INSERT INTO ' + TABLE_NETFLIX_PRIMARY + ' (title, show_id, cast, country, date_added, description, director, duration, listed_in, rating, release_year, type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) IF NOT EXISTS;'

  const paramsJimmy = [TITLE_LIFE_OF_JIMMY, SHOW_ID_LIFE_OF_JIMMY,
    ['Jimmy'],
    ['United States'],
    new Date(2020, 6, 1),
    'Experiences of a guitar playing DataStax developer',
    ['Franky J'],
    '42 min',
    ['Action'],
    'TV-18',
    2020,
    'Movie']

  const paramsPulp = [TITLE_PULP_FICTION, SHOW_ID_PULP_FICTION,
    ['John Travolta', 'Samuel L. Jackson',
      'Uma Thurman', 'Harvey Keitel', 'Tim Roth', 'Amanda Plummer', 'Maria de Medeiros',
      'Ving Rhames', 'Eric Stoltz', 'Rosanna Arquette', 'Christopher Walken',
      'Bruce Willis'],
    ['United States'],
    new Date(2019, 1, 19),
    'This stylized crime caper weaves together stories ...',
    ['Quentin Tarantino'],
    '42 min',
    ['Classic Movies', 'Cult Movies', 'Dramas'],
    'R',
    1994,
    'Movie']

  console.log("paramsJimmy: " + paramsJimmy)
  console.log('Inserting into Primary Table for title: %s', TITLE_LIFE_OF_JIMMY)
  await client.execute(insertPrimary, paramsJimmy, { prepare: true })

  console.log('Inserting into Primary Table for title: %s', TITLE_PULP_FICTION)
  await client.execute(insertPrimary, paramsPulp, { prepare: true })
}

async function insertTitlesByDateRecords() {

  const insertTitlesByDate = 'INSERT INTO ' +
    TABLE_NETFLIX_TITLES_BY_DATE +
    ' (show_id, date_added, release_year, title, type) VALUES (?,?,?,?,?) IF NOT EXISTS;'

  const paramsJimmy = [
    SHOW_ID_LIFE_OF_JIMMY,
    new Date(2020, 6, 1),
    2020,
    TITLE_LIFE_OF_JIMMY,
    'Movie'
  ]

  const paramsPulp = [
    SHOW_ID_PULP_FICTION,
    new Date(2019, 1, 19),
    1994,
    TITLE_PULP_FICTION,
    'Movie'
  ]

  console.log('Inserting into TitlesByDate Table for title: %s', TITLE_LIFE_OF_JIMMY)
  await client.execute(insertTitlesByDate, paramsJimmy, { prepare: true })

  console.log('Inserting into TitlesByDate Table for title: %s', TITLE_PULP_FICTION);
  await client.execute(insertTitlesByDate, paramsPulp, { prepare: true })
}

async function insertTitlesByRatingRecords() {

  const insertTitlesByRating = 'INSERT INTO ' +
    TABLE_NETFLIX_TITLES_BY_RATING +
    ' (show_id, rating, title) VALUES (?,?,?) IF NOT EXISTS;'

  const paramsJimmy = [
    SHOW_ID_LIFE_OF_JIMMY,
    "TV-18",
    TITLE_LIFE_OF_JIMMY
  ];


  const paramsPulp = [
    SHOW_ID_PULP_FICTION,
    "R",
    TITLE_PULP_FICTION
  ]

  console.log('Inserting into TitlesByRating Table for title: %s', TITLE_LIFE_OF_JIMMY)
  await client.execute(insertTitlesByRating, paramsJimmy, { prepare: true })

  console.log('Inserting into TitlesByRating Table for title: %s', TITLE_PULP_FICTION)
  await client.execute(insertTitlesByRating, paramsPulp, { prepare: true })
}

async function readAll(tableName) {

  const selectAll = 'SELECT * FROM ' + tableName + ';'
  console.log('Selecting all from Table: %s', tableName)
  return client.execute(selectAll)

}

async function readAllInPrimaryByTitle(titleName) {

  const selectAll = 'SELECT * FROM ' + TABLE_NETFLIX_PRIMARY + ' WHERE title = ? ;'
  const paramsSelect = [titleName]

  console.log('Selecting all by Title: %s from Primary table', titleName)
  return client.execute(selectAll, paramsSelect, { prepare: true })

}

async function readDirectorInPrimaryByTitle(titleName) {

  const selectDirector = 'SELECT director FROM ' + TABLE_NETFLIX_PRIMARY + ' WHERE title = ?;'
  const paramsSelect = [titleName]

  console.log('Selecting director by Title: %s from Primary table', titleName)
  return client.execute(selectDirector, paramsSelect, { prepare: true })
}

async function updateDirectorInPrimaryByTitle(showId, titleName, directorList) {

  const updateDirector = 'UPDATE ' + TABLE_NETFLIX_PRIMARY +
    ' SET director = ? WHERE show_id = ? AND title = ?'
  const paramsUpdate = [directorList, showId, titleName]

  console.log('Updating director list by Title: %s and Show ID: %s from Primary table', titleName, showId)
  return client.execute(updateDirector, paramsUpdate, { prepare: true })
}

async function print(result) {
  if (result.error) throw result.error

  if (result.rows) {
    console.log("Rows in result: %d", result.rowLength)
    result.rows.forEach(r => console.log(r));
  }
}


async function netflixWithNodeJS() {

  try {

    console.log("Connected - step 1")
    console.log("Creating a keyspace and using - step 2")
    await createKeyspace()
    await client.execute("USE " + KEYSPACE_NAME)

    console.log("Creating tables - step 3")
    await createPrimaryTable()
    await createTitlesByDateTable()
    await createTitlesByRatingTable()

    console.log("Inserting records - step 4")
    await insertPrimaryRecords()
    await insertTitlesByDateRecords()
    await insertTitlesByRatingRecords()

    console.log("Reading records - step 5")
    print(await readAll(TABLE_NETFLIX_PRIMARY))
    print(await readAll(TABLE_NETFLIX_TITLES_BY_RATING))
    print(await readAll(TABLE_NETFLIX_TITLES_BY_DATE))

    print(await readAllInPrimaryByTitle(TITLE_PULP_FICTION))
    print(await readAllInPrimaryByTitle(TITLE_LIFE_OF_JIMMY))

    console.log("Updating record with read - step 6")
    print(await updateDirectorInPrimaryByTitle(SHOW_ID_PULP_FICTION,
      TITLE_PULP_FICTION,
      ['Quentin Jerome Tarantino']
    ))

    print(await (readDirectorInPrimaryByTitle(TITLE_PULP_FICTION)))

    console.log("Shutting down client - step 7")
    await client.shutdown()
  }
  catch (e) {
    console.error("Failure during Netflix Node JS experience Error: %s Details: %s", e.message, e)
  }
}

netflixWithNodeJS();
