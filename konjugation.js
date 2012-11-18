var tenses = {
  praesens: {
    'sg' :null ,
    '2sg':"-st",
    'pl' :"-en",
    '2pl':"-t" ,
    'partizip':"-end"
  },
  praeteritum: {
    'sg' :"-te"  ,
    '2sg':"-test",
    'pl' :"-ten" ,
    '2pl':"-tet" ,
    'partizip':"ge-t"
  },
  konjunctiv_i: {
    'sg' :"-e"  ,
    '2sg':"-est",
    'pl' :"-en" ,
    '2pl':"-et" ,
  },
  konjunctiv_ii: {
    'sg' :"-te" ,
    '2sg':"-test",
    'pl' :"-ten" ,
    '2pl':"-tet" 
  },
  imperativ: {
    '2sg': '-e' ,
    'pl' : '-en',
    '2pl': '-t' ,
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
};

function conjugate(group, stem, tense, count, person, participle) {
  var affixes, prefix, suffix, klass;

  if (stems[stem] && stems[stem][tense]) {
    stem = (typeof(stems[stem][tense]) == 'string' ? stems[stem][tense]: undefined) || stems[stem][tense][person + count] || stems[stem][tense][count] ||  stem;
  }

  if (participle) {
    affixes = tenses[tense]['partizip'];
  } else  {
    affixes = tenses[tense][person + count] || tenses[tense][count];
  }
  if (affixes) {
    affixes = affixes.split('-');
    if (participle && affixes[0] == 'ge') {
      klass = 'ge';
    } else {
      klass = affixes[1];
    }
    return [affixes[0] + (stem ? stem : '-') + affixes[1], klass];
  } else if (affixes === null) { // null means it takes no suffixes
    return [stem, ''];
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
  var gloss = menu.val();
  var stem = selection.text().replace('-', '');
  for (var tense in tenses) {
    for (var count in {'pl':null, 'sg':null}) {
      for (var person=1; person<4; person++) {
        var formclass = conjugate(null, stem, tense, count, person);
        render_td(tense, person + count, formclass[0], formclass[1]);
      }
    }
    var formclass = conjugate(null, stem, tense, null, null, true);
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