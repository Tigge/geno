import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  sv: {
    translation: {
      event: {
        type: {
          'Marriage': 'Giftermål',
          'Marriage Settlement': 'Hemskillnad',
          'Marriage License': 'Vigselbevis',
          'Marriage Contract': 'Äktenskapskontrakt',
          'Marriage Banns': 'Lysning',
          'Engagement': 'Förlovning',
          'Divorce': 'Skilsmässa',
          'Divorce Filing': 'Begäran om skilsmässa',
          'Annulment': 'Upplösning av äktenskap',
          'Alternate Marriage': 'Alternativt giftermål',
          'Adopted': 'Adopterad',
          'Birth': 'Födelse',
          'Death': 'Död',
          'Adult Christening': 'Vuxendop',
          'Baptism': 'Dop',
          'Bar Mitzvah': 'Bar mitzvah',
          'Bas Mitzvah': 'Bas mitzvah',
          'Blessing': 'Välsignelse',
          'Burial': 'Begravning',
          'Cause Of Death': 'Dödsorsak',
          'Census': 'Folkräkning',
          'Christening': 'Barndop',
          'Confirmation': 'Konfirmation',
          'Cremation': 'Kremering',
          'Degree': 'Examen',
          'Education': 'Utbildning',
          'Elected': 'Vald',
          'Emigration': 'Utflyttad',
          'First Communion': 'Första nattvarden',
          'Immigration': 'Inflyttad',
          'Graduation': 'Examen',
          'Medical Information': 'Medicinsk information',
          'Military Service': 'Militärtjänst',
          'Naturalization': 'Nytt medborgarskap',
          'Nobility Title': 'Adelstitel',
          'Number of Marriages': 'Antal giftermål',
          'Occupation': 'Yrke',
          'Ordination': 'Prästvigsel',
          'Probate': 'Bouppteckning',
          'Property': 'Egendom',
          'Religion': 'Religion',
          'Residence': 'Bosatt',
          'Retirement': 'Pensionering',
          'Will': 'Testamente'
        }
      },
      eventref: {
        type: {
          'Primary': 'Primär',
          'Clergy': 'Prästerskap',
          'Celebrant': 'Officiant',
          'Aide': 'Medhjälpare',
          'Bride': 'Brud',
          'Groom': 'Brudgum',
          'Witness': 'Vittne',
          'Family': 'Familj',
          'Informant': 'Sagesman'
        }
      },
      citation: {
        confidence: {
          0: 'Mycket låg',
          1: 'Låg',
          2: 'Normal',
          3: 'Hög',
          4: 'Mycket hög'
        },
        confidence_description: {
          0: 'Mycket låg - Otillförlitlig källa eller uppskattad uppgift',
          1: 'Låg - Ifrågasatt tillförlitlighet (t ex intevju, folkräkning, muntlig uppgift, självbiografi)',
          2: 'Normal',
          3: 'Hög - Sekundär källa',
          4: 'Mycket hög - Primär källa'
        }
      },
      note: {
        type: {
          'General': 'Allmänt',
          'Research': 'Forskning',
          'Transcript': 'Avskrift',
          'Source text': 'Källtext',
          'Citation': 'Citat',
          'Report': 'Rapport',
          'HTML code': 'HTML-kod',
          'To Do': 'Att göra',
          'Link': 'Länk'
        }
      },
      family: {
        type: {
          'Married': 'Gift',
          'Unmarried': 'Ogift',
          'Civil Union': 'Registrerat partnerskap',
          'Unknown': 'Okänd'
        },
        childref: {
          type: {
            'None': 'Inget',
            'Birth': 'Födelse',
            'Adopted': 'Adopterad',
            'Stepchild': 'Styvbarn',
            'Sponsored': 'Fadderbarn',
            'Foster': 'Fosterbarn',
            'Unknown': 'Okänd'
          }
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "sv",

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
