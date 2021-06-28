import os
import sqlite3
import flask
from flask_cors import CORS
from flask_graphql import GraphQLView

from graphene import ObjectType, String, Schema, List, Field, Boolean, Int, ID
import dataloader

app = flask.Flask(__name__)
CORS(app)


connection = sqlite3.connect('../sqlite.db', check_same_thread=False)

personloader = dataloader.PersonLoader(connection)
eventloader = dataloader.EventLoader(connection)
medialoader = dataloader.MediaLoader(connection)
familyloader = dataloader.FamilyLoader(connection)
placeloader = dataloader.PlaceLoader(connection)
referenceloader = dataloader.ReferenceLoader(connection)
citationloader = dataloader.CitationLoader(connection)
sourceloader = dataloader.SourceLoader(connection)
repositoryloader = dataloader.RepositoryLoader(connection)
noteloader = dataloader.NoteLoader(connection)
tagloader = dataloader.TagLoader(connection)


class Attribute(ObjectType):
    class Meta:
        description = 'An attribute'

    private = Boolean()
    type = String()
    value = String()


class Coordinates(ObjectType):
    class Meta:
        description = 'A coordinate'

    lat = String()
    lng = String()


class References(ObjectType):

    persons = List(lambda: Person)
    families = List(lambda: Family)
    places = List(lambda: Place)
    events = List(lambda: Event)

    def resolve_persons(root, info):
        if 'persons' not in root:
            return None
        return personloader.load_many(root['persons'])

    def resolve_families(root, info):
        # print('resolve_families', root, info)
        if 'families' not in root:
            return None
        return familyloader.load_many(root['families'])

    def resolve_places(root, info):
        if 'places' not in root:
            return None
        return placeloader.load_many(root['places'])

    def resolve_events(root, info):
        if 'events' not in root:
            return None
        return eventloader.load_many(root['events'])


class Place(ObjectType):
    class Meta:
        description = 'A place'

    handle = ID()
    name = String()
    coordinates = Field(Coordinates)

    def resolve_coordinates(root, info):
        return root['coordinates']


class ChildRef(ObjectType):
    class Meta:
        description = 'A child reference'

    child = Field(lambda: Person)
    mother_rel = String()
    father_rel = String()

    def resolve_child(root, info):
        return personloader.load(root['child'])


class Tag(ObjectType):
    class Meta:
        description = 'A tag'

    handle = ID()
    name = String()
    color = String()
    priority = String()
    change = String()


class Note(ObjectType):
    class Meta:
        description = 'A note'

    handle = ID()
    grampsId = ID()
    text = String()
    format = String()
    type = String()
    change = String()
    tags = List(Tag)
    private = Boolean()

    def resolve_tags(root, info):
        return tagloader.load_many(root['tag_handles'])


class Media(ObjectType):
    class Meta:
        description = 'A media'

    handle = ID()
    path = String()
    mime = String()
    desc = String()
    date = String()
    attributes = List(Attribute)


class MediaRef(ObjectType):
    class Meta:
        description = 'A media reference'

    private = Boolean()
    notes = List(String)
    attributes = List(Attribute)
    media = Field(Media)

    def resolve_media(root, info):
        return medialoader.load(root['id'])


class Repository(ObjectType):
    class Meta:
        description = 'A repository'

    handle = ID()
    private = Boolean()
    gramps_id = ID()
    type = String()
    name = String()


class RepositoryRef(ObjectType):
    class Meta:
        description = 'A repository reference'

    private = Boolean()
    repository = Field(Repository)
    type = String()
    call_number = String()

    def resolve_repository(root, info):
        return repositoryloader.load(root['repository_handle'])


class Source(ObjectType):
    class Meta:
        description = 'A source'

    handle = ID()
    private = Boolean()
    gramps_id = ID()
    title = String()
    author = String()
    pubinfo = String()
    abbrev = String()
    attributes = List(Attribute)
    repositoryrefs = List(RepositoryRef)


class Citation(ObjectType):
    class Meta:
        description = 'A citation'

    handle = ID()
    gramps_id = ID()
    date = String()
    page = String()
    confidence = Int()
    source = Field(Source)
    notes = List(Note)
    mediarefs = List(MediaRef)
    attributes = List(Attribute)
    change = String()
    tags = List(Tag)
    private = Boolean()

    def resolve_tags(root, info):
        return tagloader.load_many(root['tag_handles'])

    def resolve_notes(root, info):
        return noteloader.load_many(root['note_handles'])

    def resolve_source(root, info):
        return sourceloader.load(root['source_handle'])


class Event(ObjectType):
    class Meta:
        description = 'An event'

    handle = ID()
    gramps_id = String()
    type = String()
    date = String()
    description = String()
    place = Field(Place)
    citations = List(Citation)
    note_list = String()
    mediarefs = List(MediaRef)
    attributes = List(Attribute)
    references = Field(References)

    def resolve_place(root, info):
        if(root['place'] is None):
            return None
        return placeloader.load(root['place'])

    def resolve_references(root, info):
        return referenceloader.load(root['handle'])

    def resolve_citations(root, info):
        return citationloader.load_many(root['citation_list'])


class EventRef(ObjectType):
    class Meta:
        description = 'An event reference'

    id = ID()
    private = Boolean()
    notes = List(String)
    attributes = List(String)
    type = String()
    event = Field(Event)

    def resolve_event(root, info):
        return eventloader.load(root['id'])


class Family(ObjectType):
    class Meta:
        description = 'A family'

    handle = ID()
    gramps_id = String()
    father = Field(lambda: Person)
    mother = Field(lambda: Person)
    childrefs = List(lambda: ChildRef)
    type = String()
    tags = List(Tag)

    def resolve_father(root, info):
        return personloader.load(root['father_handle'])

    def resolve_mother(root, info):
        return personloader.load(root['mother_handle'])

    def resolve_tags(root, info):
        return tagloader.load_many(root['tag_handles'])


class Person(ObjectType):
    class Meta:
        description = 'A human'

    handle = ID()
    gramps_id = String()
    gender = String()
    name = String()
    birthrefindex = Int()
    deathrefindex = Int()
    families = List(Family)
    parent_families = List(Family)
    mediarefs = List(MediaRef)
    eventrefs = List(EventRef)
    tags = List(Tag)

    def resolve_families(root, info):
        # print('resolve_families', root['families'], info)
        return familyloader.load_many(root['families'])

    def resolve_parent_families(root, info):
        # print('resolve_parent_families', root['parent_families'], info)
        return familyloader.load_many(root['parent_families'])

    def resolve_tags(root, info):
        return tagloader.load_many(root['tag_handles'])


class Query(ObjectType):
    persons = List(Person)
    person = Field(Person, handle=String(required=True))

    event = Field(Event, handle=String(required=True))

    def resolve_persons(root, info):
        return personloader.all()

    def resolve_person(root, info, handle):
        return personloader.load(handle)

    def resolve_event(root, info, handle):
        return eventloader.load(handle)


schema = Schema(query=Query)

app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True  # for having the GraphiQL interface
    )
)


@app.route('/')
@app.route('/person/<string:id>')
def main(**kwargs):
    return flask.send_file(os.path.join(app.root_path, '../client/dist/index.html'))


@app.route('/<path:path>')
def fallback(path):
    return flask.send_from_directory(os.path.join(app.root_path, '../client/dist/'), path)
