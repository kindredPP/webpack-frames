const initor = (type, fn) => {
	typeof fn === "function" ||
		(fn = x => x);
	const re = (...args) =>
		({ payload: fn(...args), type });
	re.type = type;
	return re;
};

export const SELECT_REDDIT = initor("SELECT_REDDIT");
export const INVALID_REDDIT = initor("INVALID_REDDIT");
export const REQUEST_REDDIT = initor("REQUEST_REDDIT");
export const RECEIVE_REDDIT = initor("RECEIVE_REDDIT",
	(reddit, data, date) => ({ reddit, data, date })
);
export const FETCH_REDDIT = reddit => store => {
	store.dispatch(REQUEST_REDDIT(reddit));
	$.ajax({
		url: "https://api.github.com/search/repositories",
		data: {
			sort: "stars",
			order: "desc",
			q: [
				"topic:" + reddit,
				"language:" + reddit,
			].join(" "),
		},
		crossDomain: true,
	}).always(v => {
		const data = v && v.items;
		const date = new Date().toLocaleString();
		store.dispatch(RECEIVE_REDDIT(reddit, data, date));
	});
};
const checkReddit = (reddit, history) => {
	if (reddit && history) {
		const { infetch, invalid } = history[reddit] || {};
		return (infetch == null) || (!infetch && invalid);
	}
};
export const NEED_REDDIT = reddit => store => {
	const { history } = store.getState() || {};
	checkReddit(reddit, history) &&
		store.dispatch(FETCH_REDDIT(reddit));
};