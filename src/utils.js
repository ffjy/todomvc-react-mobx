export function	uuid() {
	/*jshint bitwise:false */
	var i, random;
	var uuid = '';

	for (i = 0; i < 32; i++) {
		random = Math.random() * 16 | 0;
		if (i === 8 || i === 12 || i === 16 || i === 20) {
			uuid += '-';
		}
		uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
			.toString(16);
	}

	return uuid;
}

export function save(key, val) {
  if (typeof val !== 'string') {
    val = JSON.stringify(val);
  }
  localStorage.setItem(key, val)
}

export function get(key) {
  return JSON.parse(
    localStorage.getItem(key)
  );
}

export function clear() {
  localStorage.clear();
}

export function remove(key) {
  localStorage.removeItem(key);
}