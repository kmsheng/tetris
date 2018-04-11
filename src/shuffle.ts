// https://bost.ocks.org/mike/shuffle/compare.html
// https://github.com/Daplie/knuth-shuffle
export default function shuffle<T>(a: T[]): T[] {

  const arr = a.slice(0);
  let length = arr.length;

  if (length < 2) {
    return arr;
  }

  while (length) {

    let randomIndex = Math.floor(Math.random() * length--);
    let randomElement = arr[randomIndex];

    while (randomIndex < length) {
      arr[randomIndex] = arr[++randomIndex];
    }

    arr[randomIndex] = randomElement;
  }

  return arr;
}
