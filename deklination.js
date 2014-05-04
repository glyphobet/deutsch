var suffixe = {
  nominativ : {
      maskulinum : '',
      neutrum    : '',
      femininum  : 'e',
      plural     : 'e'
  },
  akkusativ : {
      maskulinum : 'en',
      neutrum    : '',
      femininum  : 'e',
      plural     : 'e'
  },
  dativ     : {
      maskulinum : 'em',
      neutrum    : 'em',
      femininum  : 'er',
      plural     : 'en'
  },
  genitiv   : {
      maskulinum : 'es',
      neutrum    : 'es',
      femininum  : 'er',
      plural     : 'er'
  }
};
var bestimmt_suffixe = {
  nominativ : {
    maskulinum : 'er',
    neutrum    : 'es'
  },
  akkusativ : {
    neutrum    : 'es'
  }
};
var exceptions = {
  bestimmt : {
    nominativ : {
      neutrum   : 'as'
    },
    akkusativ : {
      neutrum   : 'as'
    }
  },
  relativ : {
    nominativ : {
      neutrum   : 'as'
    },
    akkusativ : {
      neutrum   : 'as'
    },
    dativ : {
      plural : 'enen'
    },
    genitiv : {
      maskulinum : 'essen',
      neutrum    : 'essen',
      femininum  : 'eren', // derer?
      plural     : 'eren'  // derer?
    }
  },
  gemischte : {
    nominativ : {
      maskulinum: 'er',
      femininum: 'e',
      neutrum: 'es'
    },
    akkusativ: {
      femininum: 'e',
      neutrum: 'es'
    }
  },
  schwache : {
    nominativ : {
      maskulinum: 'e',
      femininum: 'e',
      neutrum: 'e'
    },
    akkusativ: {
      femininum: 'e',
      neutrum: 'e'
    }
  }
};
// We use 'kase' because 'case' is a keyword in JavaScript
function find_suffix(group, gloss, kase, gender) {
  if (exceptions[gloss] && exceptions[gloss][kase] && exceptions[gloss][kase][gender]) {
    return exceptions[gloss][kase][gender];
  }
  if (group == 'bestimmt' || (group == 'adjektive' && gloss == 'starke')) {
    return (bestimmt_suffixe[kase] || {})[gender] || suffixe[kase][gender];
  }
  if (group == 'adjektive') {
    return 'en';
  }
  return suffixe[kase][gender];
}
function decline(group, gloss, stem, kase, gender, suffix) {
  if (stem == 'ein' && gender == 'plural') {
    return '';
  } else if (stem == 'eur' && suffix === '') {
    return 'eu<b>e</b>r';
  } else {
    if (gloss == 'bestimmt' || gloss == 'relativ') {
      stem = 'd';
      if (suffix == 'e') {
        return 'die';
      }
    } else if (group == 'adjektive') {
      stem = '';
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
      $('table#bestimmungswoertern tr.' + kase + ' > td.' + gender).html(form).removeClass('e er en em es as eren enen essen').addClass(suffix);
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