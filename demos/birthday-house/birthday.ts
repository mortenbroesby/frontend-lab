import { tr } from './language';
import photo from './birthday-photo.png';
export const birthday = {
  photo,
  get alt() {
    return tr(
      'Kasper smiler ved et restaurantbord med dannebrogsflag og gyldne stjerner bag sig.',
      'Kasper smiles at a restaurant table, with Danish flags and golden stars behind him.',
    );
  },
  get greeting() {
    return tr('Tillykke med fødselsdagen, Kasper!', 'Happy birthday, Kasper!');
  },
  get message() {
    return tr(
      'Du gør hverdagens små øjeblikke til minder, vi gemmer. Må det næste år byde på lune morgener, små eventyr og vejen hjem sammen.',
      'You turn little everyday moments into memories we treasure. May the year ahead bring warm mornings, small adventures and walks home together.',
    );
  },
};
