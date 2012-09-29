var suffixe = {
  nominativ : {
      masculinen : '',
      neutral    : '',
      femininum  : 'e',
      plural     : 'e'
  },
  akkusativ : {
      masculinen : 'en',
      neutral    : '',
      femininum  : 'e',
      plural     : 'e'
  },
  dativ     : {
      masculinen : 'em',
      neutral    : 'em',
      femininum  : 'er',
      plural     : 'en'
  },
  genitiv   : {
      masculinen : 'es',
      neutral    : 'es',
      femininum  : 'er',
      plural     : 'er'
  }
};
var bestimmt_suffixe = {
  nominativ : {
    masculinen : 'er',
    neutral    : 'es'
  },
  akkusativ : {
    neutral    : 'es'
  }
};
var exceptions = {
  bestimmt : {
    nominativ : {
      neutral   : 'as'
    },
    akkusativ : {
      neutral   : 'as'
    }
  },
  relativ : {
    nominativ : {
      neutral   : 'as'
    },
    akkusativ : {
      neutral   : 'as'
    },
    dativ : {
      plural : 'enen'
    },
    genitiv : {
      masculinen : 'essen',
      neutral    : 'essen',
      femininum  : 'eren', // derer?
      plural     : 'eren'  // derer?
    }
  }
};
// We use 'kase' because 'case' is a keyword in JavaScript
function find_suffix(group, gloss, kase, gender) {
  if (exceptions[gloss] && exceptions[gloss][kase] && exceptions[gloss][kase][gender]) {
    return exceptions[gloss][kase][gender];
  }
  if (group == 'bestimmt' && bestimmt_suffixe[kase] && bestimmt_suffixe[kase][gender]) {
    return bestimmt_suffixe[kase][gender];
  }
  return suffixe[kase][gender];
}
function decline(group, gloss, stem, kase, gender, suffix) {
  if (stem == 'ein' && gender == 'plural') {
    return '';
  } else if (stem == 'eur' && suffix === '') {
    return 'euer';
  } else {
    if (gloss == 'bestimmt' || gloss == 'relativ') {
      stem = 'd';
      if (suffix == 'e') {
        return 'die';
      }
    }
    return (stem ? stem : (suffix ? '-' : '')) + suffix;
  }
}
function render() {
  var menu = $('#stem');
  var selection = menu.find('option:selected');
  var group = selection.parent('optgroup').attr('label');
  var gloss = menu.val();
  var stem = selection.text().replace('-', '');
  for (var kase in suffixe) {
    for (var gender in suffixe[kase]) {
      var suffix = find_suffix(group, gloss, kase, gender);
      var form = decline(group, gloss, stem, kase, gender, suffix);
      if (! form.length || form.slice(-suffix.length) != suffix) {
        suffix = '';
      }
      $('table#bestimmungswoertern tr.' + kase + ' > td.' + gender).text(form).removeClass('e er en em es as eren essen').addClass(suffix);
    }
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