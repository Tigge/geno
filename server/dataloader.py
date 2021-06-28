import pickle
from promise import Promise
from promise.dataloader import DataLoader
import pprint


def _qmark(array):
    return ','.join(['?'] * len(array))


def parse_name(name_row):
    return "{} {}".format(name_row[4], name_row[5][0][0])


def get_eventref(eventref):

    type = {
        1: 'Primary',
        2: 'Clergy',
        3: 'Celebrant',
        4: 'Aide',
        5: 'Bride',
        6: 'Groom',
        7: 'Witness',
        8: 'Family',
        9: 'Informant'
    }

    return {
        "id": eventref[3],
        "private": eventref[0],
        "notes": eventref[1],
        "attributes": eventref[2],
        "type": type.get(eventref[4][0], eventref[4][1])
    }


def get_mediaref(mediaref):

    return {
        "id": mediaref[4],
        "private": mediaref[0],
        "notes": mediaref[2],
        "attributes": mediaref[3],
        "rect": mediaref[5]
    }


def get_childref(childref):

    type = {
        0: 'None',
        1: 'Birth',
        2: 'Adopted',
        3: 'Stepchild',
        4: 'Sponsored',
        5: 'Foster',
        6: 'Unknown'
    }

    return {
        "child": childref[3],
        "private": childref[0],
        "mother_rel": type.get(childref[4][0], childref[4][1]),
        "father_rel": type.get(childref[5][0], childref[5][1])
    }


def get_repositoryref(repositoryref):

    type = {
        1: 'Audio',
        2: 'Book',
        3: 'Card',
        4: 'Electronic',
        5: 'Fiche',
        6: 'Film',
        7: 'Magazine',
        8: 'Manuscript',
        9: 'Map',
        10: 'Newspaper',
        11: 'Photo',
        12: 'Tombstone',
        13: 'Video'
    }

    return {
        "private": repositoryref[4],
        "repository_handle": repositoryref[1],
        "call_number": repositoryref[2],
        "type": type.get(repositoryref[3][0], repositoryref[3][1])
    }


def get_attributes(attributes):
    return list(map(lambda attribute: {
        "private": attribute[0],
        "type": attribute[3][1],
        "value": attribute[4]
    }, attributes))


def get_source_attributes(attributes):
    return list(map(lambda attribute: {
        "private": attribute[0],
        "type": attribute[1][1],
        "value": attribute[2]
    }, attributes))


def parse_date(date_pickle):
    if date_pickle is None:
        return None

    return "{:04}-{:02}-{:02}".format(date_pickle[3][2], date_pickle[3][1], date_pickle[3][0])


def parse_tag(tag):
    data = pickle.loads(tag[1])

    return {
        "handle": data[0],
        "name": data[1],
        "color": data[2],
        "priority": data[3],
        "change": data[4]
    }


class TagLoader(DataLoader):
    def __init__(self, connection):
        DataLoader.__init__(self)
        self.connection = connection

    def batch_load_fn(self, keys):
        query = 'SELECT * FROM tag WHERE handle IN ({})'.format(_qmark(keys))
        cursor = self.connection.execute(query, keys)
        result = {}
        for row in cursor:
            tag = parse_tag(row)
            result[tag['handle']] = tag

        return Promise.resolve([result.get(key, None) for key in keys])


def parse_note(note):
    data = pickle.loads(note[1])

    type = {
        1: 'General',
        2: 'Research',
        3: 'Transcript',
        21: 'Source text',
        22: 'Citation',
        23: 'Report',
        24: 'HTML code',
        25: 'To Do',
        26: 'Link'
    }

    return {
        "handle": data[0],
        "gramps_id": data[1],
        "text": data[2][0],
        "format": data[3],
        "type": type.get(data[4][0], data[4][1]),
        "change": data[5],
        "tag_handles": data[6],
        "private": data[7],
    }


class NoteLoader(DataLoader):
    def __init__(self, connection):
        DataLoader.__init__(self)
        self.connection = connection

    def batch_load_fn(self, keys):
        query = 'SELECT * FROM note WHERE handle IN ({})'.format(_qmark(keys))
        cursor = self.connection.execute(query, keys)
        result = {}
        for row in cursor:
            note = parse_note(row)
            result[note['handle']] = note

        return Promise.resolve([result.get(key, None) for key in keys])


def parse_repository(source):
    data = pickle.loads(source[1])

    type = {
        1: 'Library',
        2: 'Cemetary',
        3: 'Church',
        4: 'Archive',
        5: 'Album',
        6: 'Web site',
        7: 'Bookstore',
        8: 'Collection',
        9: 'Safe'
    }

    return {
        "handle": data[0],
        "private": data[9],
        "gramps_id": data[1],
        "type": type.get(data[2][0], data[2][1]),
        "name": data[3]
    }


class RepositoryLoader(DataLoader):
    def __init__(self, connection):
        DataLoader.__init__(self)
        self.connection = connection

    def batch_load_fn(self, keys):
        query = 'SELECT * FROM repository WHERE handle IN ({})'.format(_qmark(keys))
        cursor = self.connection.execute(query, keys)
        result = {}
        for row in cursor:
            repository = parse_repository(row)
            result[repository['handle']] = repository

        return Promise.resolve([result.get(key, None) for key in keys])


def parse_source(source):
    data = pickle.loads(source[1])

    return {
        "handle": data[0],
        "private": data[12],
        "gramps_id": data[1],
        "title": data[2],
        "author": data[3],
        "pubinfo": data[4],
        "abbrev": data[7],
        "attributes": get_source_attributes(data[9]),
        "repositoryrefs": list(map(get_repositoryref, data[10])),
    }


class SourceLoader(DataLoader):
    def __init__(self, connection):
        DataLoader.__init__(self)
        self.connection = connection

    def batch_load_fn(self, keys):
        query = 'SELECT * FROM source WHERE handle IN ({})'.format(_qmark(keys))
        cursor = self.connection.execute(query, keys)
        result = {}
        for row in cursor:
            source = parse_source(row)
            result[source['handle']] = source

        return Promise.resolve([result.get(key, None) for key in keys])


def parse_citation(citation):
    data = pickle.loads(citation[1])

    return {
        "handle": data[0],
        "gramps_id": data[1],
        "date": parse_date(data[2]),
        "page": data[3],
        "confidence": data[4],
        "source_handle": data[5],
        "note_handles": data[6],
        "mediarefs": list(map(get_mediaref, data[7])),
        "attributes": get_source_attributes(data[8]),
        "change": data[9],
        "tag_handles": data[10],
        "private": data[11],
    }


class CitationLoader(DataLoader):
    def __init__(self, connection):
        DataLoader.__init__(self)
        self.connection = connection

    def batch_load_fn(self, keys):
        query = 'SELECT * FROM citation WHERE handle IN ({})'.format(_qmark(keys))
        cursor = self.connection.execute(query, keys)
        result = {}
        for row in cursor:
            citation = parse_citation(row)
            result[citation['handle']] = citation

        return Promise.resolve([result.get(key, None) for key in keys])


class ReferenceLoader(DataLoader):
    def __init__(self, connection):
        DataLoader.__init__(self)
        self.connection = connection

    def batch_load_fn(self, keys):
        query = 'SELECT * FROM reference WHERE ref_handle IN ({})'.format(_qmark(keys))
        cursor = self.connection.execute(query, keys)
        result = {}
        for row in cursor:
            classmap = {
                'Person': 'persons',
                'Event': 'events',
                'Place': 'places',
                'Family': 'families'
            }

            # print('refs row', row)

            if row[1] not in classmap:
                continue
            objclass = classmap[row[1]]

            data = result.get(row[2], {})
            classes = data.get(objclass, [])
            classes.append(row[0])
            data[objclass] = classes
            result[row[2]] = data

        # print('refs', keys, result)

        return Promise.resolve([result.get(key, None) for key in keys])


def parse_person(person_row):
    data = pickle.loads(person_row[3])

    return {
      "handle": data[0],
      "gramps_id": data[1],
      "gender": data[2],
      "name": parse_name(data[3]),
      "deathrefindex": data[5] if data[5] != -1 else None,
      "birthrefindex": data[6] if data[6] != -1 else None,
      "families": data[8],
      "parent_families": data[9],
      "eventrefs": list(map(get_eventref, data[7])),
      "mediarefs": list(map(get_mediaref, data[10])),
      "tag_handles": data[18]
    }


class PersonLoader(DataLoader):
    def __init__(self, connection):
        DataLoader.__init__(self)
        self.connection = connection

    def batch_load_fn(self, keys):
        query = 'SELECT * FROM person WHERE handle IN ({})'.format(_qmark(keys))
        cursor = self.connection.execute(query, keys)
        result = {}
        for row in cursor:
            person = parse_person(row)
            result[person['handle']] = person

        return Promise.resolve([result.get(key, None) for key in keys])

    def all(self):
        cursor = self.connection.execute('SELECT * FROM person')
        persons = cursor.fetchall()
        for person in persons:
            self.prime(person[0], person)
        return Promise.resolve(list(map(parse_person, persons)))


def parse_event(event):
    data = pickle.loads(event[1])

    types = {
        1: 'Marriage',
        2: 'Marriage Settlement',
        3: 'Marriage License',
        4: 'Marriage Contract',
        5: 'Marriage Banns',
        6: 'Engagement',
        7: 'Divorce',
        8: 'Divorce Filing',
        9: 'Annulment',
        10: 'Alternate Marriage',
        11: 'Adopted',
        12: 'Birth',
        13: 'Death',
        14: 'Adult Christening',
        15: 'Baptism',
        16: 'Bar Mitzvah',
        17: 'Bas Mitzvah',
        18: 'Blessing',
        19: 'Burial',
        20: 'Cause Of Death',
        21: 'Census',
        22: 'Christening',
        23: 'Confirmation',
        24: 'Cremation',
        25: 'Degree',
        26: 'Education',
        27: 'Elected',
        28: 'Emigration',
        29: 'First Communion',
        30: 'Immigration',
        31: 'Graduation',
        32: 'Medical Information',
        33: 'Military Service',
        34: 'Naturalization',
        35: 'Nobility Title',
        36: 'Number of Marriages',
        37: 'Occupation',
        38: 'Ordination',
        39: 'Probate',
        40: 'Property',
        41: 'Religion',
        42: 'Residence',
        43: 'Retirement',
        44: 'Will'
    }

    pprint.pprint(data[9])

    return {
        "handle": data[0],
        "gramps_id": data[1],
        "type": types.get(data[2][0], data[2][1]),
        "date": parse_date(data[3]),
        "description": data[4],
        "place": data[5] if data[5] != '' else None,
        "citation_list": data[6],
        "note_handles": data[7],
        "mediarefs": list(map(get_mediaref, data[8])),
        "attributes": get_attributes(data[9]),
        "change": data[10],
        "tag_handles": data[11],
        "private": data[12]
    }


class EventLoader(DataLoader):
    def __init__(self, connection):
        DataLoader.__init__(self)
        self.connection = connection

    def batch_load_fn(self, keys):
        query = 'SELECT * FROM event WHERE handle IN ({})'.format(_qmark(keys))
        cursor = self.connection.execute(query, keys)
        result = {}
        for row in cursor:
            event = parse_event(row)
            result[event['handle']] = event

        return Promise.resolve([result.get(key, None) for key in keys])


def parse_media(row):
    p = pickle.loads(row[1])

    return {
      "handle": p[0],
      "gramps_id": p[1],
      "path": p[2],
      "mime": p[3],
      "desc": p[4],
      "date": parse_date(p[10]),
      "attributes": get_attributes(p[6])
    }


class MediaLoader(DataLoader):
    def __init__(self, connection):
        DataLoader.__init__(self)
        self.connection = connection

    def batch_load_fn(self, keys):
        query = 'SELECT * FROM media WHERE handle IN ({})'.format(_qmark(keys))
        cursor = self.connection.execute(query, keys)
        result = {}
        for row in cursor:
            media = parse_media(row)
            result[media['handle']] = media

        return Promise.resolve([result.get(key, None) for key in keys])


def parse_family(f):
    data = pickle.loads(f[1])

    type = {
        0: 'Married',
        1: 'Unmarried',
        2: 'Civil Union',
        3: 'Unknown'
    }

    return {
        "handle": data[0],
        "gramps_id": data[1],
        "father_handle": data[2],
        "mother_handle": data[3],
        "childrefs": list(map(get_childref, data[4])),
        "type": type.get(data[5][0], data[5][1])
    }


class FamilyLoader(DataLoader):
    def __init__(self, connection):
        DataLoader.__init__(self)
        self.connection = connection

    def batch_load_fn(self, keys):
        query = 'SELECT * FROM family WHERE handle IN ({})'.format(_qmark(keys))
        cursor = self.connection.execute(query, keys)
        result = {}
        for row in cursor:
            family = parse_family(row)
            result[family['handle']] = family

        return Promise.resolve([result.get(key, None) for key in keys])


def parse_place(f):
    data = pickle.loads(f[2])

    # pprint.pprint(data)

    coordinates = None if data[3] == '' and data[4] == '' else {
        "lat": data[4],
        "lng": data[3]
    }

    return {
        "handle": data[0],
        "name": data[6][0],
        "coordinates": coordinates
    }


class PlaceLoader(DataLoader):
    def __init__(self, connection):
        DataLoader.__init__(self)
        self.connection = connection

    def batch_load_fn(self, keys):
        query = 'SELECT * FROM place WHERE handle IN ({})'.format(_qmark(keys))
        cursor = self.connection.execute(query, keys)
        result = {}
        for row in cursor:
            place = parse_place(row)
            result[place['handle']] = place

        return Promise.resolve([result.get(key, None) for key in keys])
