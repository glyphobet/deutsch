var konjugation =
{ praesens:
  { '1sg': '-e'
  , '2sg': '-st'
  , '3sg': '-t'
  , pl: '-en'
  , '2pl': '-t'
  , partizip: '-end'
  }
, praeteritum:
  { sg : '-te'
  , '2sg': '-test'
  , pl : '-ten'
  , '2pl': '-tet'
  , partizip: 'ge-t'
  }
, konjunctiv_i:
  { sg : '-e'
  , '2sg': '-est'
  , pl : '-en'
  , '2pl': '-et'
  }
, konjunctiv_ii:
  { sg : '-te'
  , '2sg': '-test'
  , pl : '-ten'
  , '2pl': '-tet'
  }
, imperativ:
  { '2sg': '-e'
  , pl : '-en'
  , '2pl': '-t'
  }
};

var konjugation_groups =
{ modalverben:
  { praesens:
    { sg      : null
    , '2sg'   : konjugation.praesens['2sg']
    , pl      : konjugation.praesens.pl
    , '2pl'   : konjugation.praesens['2pl']
    , partizip: konjugation.praesens.partizip
    }
  }
};

var stems =
{ 'dürf':
  { praesens:
    { sg: 'd<b>a</b>rf' }
    , praeteritum: 'd<b>u</b>rf'
  }
, 'könn':
  { praesens:
    { sg: 'k<b>a</b>nn' }
  , praeteritum: 'k<b>o</b>nn'
  }
, 'mög':
  { praesens:
    { sg: 'm<b>a</b>g' }
  , praeteritum  : 'm<b>och</b>'
  , konjunctiv_ii: 'm<b>och</b>'
  }
, 'müss':
  { praesens:
    { sg: 'm<b>u</b>ss'
    , '2sg': 'm<b>u</b>s'
    }
  , praeteritum: 'm<b>u</b>ss'
  }
, 'woll':
  { praesens:
    { sg: 'w<b>i</b>ll' }
  }
, 'sei':
  { praeteritum: 'war'
  , konjunctiv_i: 'sei'
  , konjunctiv_ii: 'w<b>&auml</b>r'
  }
, 'werd':
  { praesens:
    { '2sg': 'w<b>i</b>r'
    , '3sg': 'w<b>i</b>r'
    }
  , praeteritum: 'w<b>u</b>rd'
  , konjunctiv_ii: 'w<b>&uuml</b>rd'
  }
, 'hab':
  { praesens: 
    { '2sg': 'ha'
    , '3sg': 'ha'
    }
  , praeteritum: 'ha<b>t</b>'
  , konjunctiv_ii: 'h<b>&auml;t</b>'
  }
, 'tu':
  { praeteritum: 't<b>a</b>'
  , konjunctiv_ii: 't<b>&auml;</b>'
  }
};

// werd- => praeteritum & konjunctiv_ii: no 't'
// sein- => praeteritum & konjunctiv_ii: no 't'

var exceptions =
{ sei:
  { praesens:
    { '1sg': 'bin'
    , '2sg': 'bist'
    , '3sg': 'ist'
    , '1pl': 'sind'
    , '2pl': 'seid'
    , '3pl': 'sind'
    }
  , praeteritum:
    { '1sg': 'war'
    , '3sg': 'war'
    , partizip: 'ge<b>wes</b>en'
    }
  , konjunctiv_i:
    { '1sg': 'sei'
    , '3sg': 'sei'
    }
  }
, werd:
  { praesens:
    { '3sg': 'w<b>i</b>rd' }
  , praeteritum:
    { partizip: 'ge<b>word</b>en' }
  }
, hab:
  { praeteritum:
    { partizip: 'ge<b>hab</b>t' }
  }
, tu:
  { praeteritum:
    { '1sg'   : 't<b>a</b>t'
    , '3sg'   : 't<b>a</b>t'
    , partizip: 'ge<b>ta</b>n'
    }
  }
};

function conjugate(group, stem, tense, count, person, participle) {
  var affixes, prefix, suffix, form, klass, pcp;

  pcp = (participle ? 'partizip' : person + count);
  var k = ((konjugation_groups[group] || {})[tense] || konjugation[tense]);
  affixes = k[pcp] || k[count];

  form = (stem ? stem : '-');
  if (stems[stem] && stems[stem][tense]) {
    form = typeof(stems[stem][tense]) == 'string' ? stems[stem][tense] : ( stems[stem][tense][person + count] || stems[stem][tense][count] || stem );
  }

  if (((exceptions[stem] || {})[tense] || {})[pcp]) {
    return [exceptions[stem][tense][pcp], ''];
  } else if (affixes) {
    affixes = affixes.split('-');
    if (participle && affixes[0] == 'ge') {
      klass = 'ge';
    } else {
      klass = affixes[1];
    }
    prefix = affixes[0];
    suffix = affixes[1];
    form = prefix + form;
    if (form.slice(-1) == 't' && suffix.slice(0,1) == 't') {
      form += 'e';
    }
    if ((form.slice(-2) == 'en' || form.slice(-2) == 'el') && (suffix == 'en')) {
      suffix = 'n';
    }
    return [form + suffix, klass];
  } else if (affixes === null) { // null means it takes no suffixes
    return [form, ''];
  } else { // undefined means there is no form
    return ['', ''];
  }
}
function render_td(tense, countperson, form, klass) {
    $('table#konjugation tr.' + tense + ' > td.' + countperson).html(form).removeClass('st est test en ten t et tet e te ge end').addClass(klass);
}
function render() {
  var menu = $('#stem');
  var selection = menu.find('option:selected');
  var group = selection.parent('optgroup').attr('label');
  var stem = selection.text().replace('-', '');
  var formclass;
  for (var tense in konjugation) {
    for (var count in {'pl':null, 'sg':null}) {
      for (var person=1; person<4; person++) {
        formclass = conjugate(group, stem, tense, count, person);
        render_td(tense, person + count, formclass[0], formclass[1]);
      }
    }
    formclass = conjugate(group, stem, tense, null, null, true);
    render_td(tense, 'partizip', formclass[0], formclass[1]);
  }
};
function hashchange() {
  var selected = document.location.hash.replace('#', '');
  if (selected) {
    try {
      if ($('#stem').find('option:[value='+selected+']').length) {
        $('#stem').val(selected);
      } else {
        document.location.hash = '';
      }
    } catch (error) {
      document.location.hash = '';
    }
  } else {
    $($('#stem option')[0]).attr('selected', true);
  }
  render();
};
function menuchange() {
  var stem = $('#stem').val();
  document.location.hash = stem;
};
$(document).ready(function () {
  $('#stem').change(menuchange);
  $(window).bind('hashchange', hashchange);
  $(window).trigger('hashchange');
});