const api = axios.create({
	baseURL: 'https://api.themoviedb.org/3/',
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
	},
	params: {
		'api_key': API_KEY,
		'language': 'es',
	}
})

async function getTrendingMoviesPreview() {
	const { data } = await api('trending/movie/day');
	const movies = data.results;

	trendingMoviesPreviewList.innerHTML = '';
	movies.forEach(movie => {
		const movieContainer = document.createElement('div');
		movieContainer.classList.add('movie-container');

		const movieImg = document.createElement('img')
		movieImg.classList.add('movie-img');
		movieImg.setAttribute('alt', movie.title);
		movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`)

		movieContainer.appendChild(movieImg);
		trendingMoviesPreviewList.appendChild(movieContainer);
	})
}

async function getCategoriesPreview() {
	const { data } = await api(`genre/movie/list`);
	const categories = data.genres;

	categoriesPreviewList.innerHTML = '';
	categories.forEach(categoria => {

		const categoryContainer = document.createElement('div');
		categoryContainer.classList.add('category-container');

		const categoryTitle = document.createElement('h3');
		categoryTitle.classList.add('category-title');
		categoryTitle.setAttribute('id', `id${categoria.id}`)
		categoryTitle.addEventListener('click', () => {
			location.hash = `category=${categoria.id}-${categoria.name}`;
		})
		const categoryText = document.createTextNode(categoria.name);

		categoryTitle.appendChild(categoryText);
		categoryContainer.appendChild(categoryTitle);
		categoriesPreviewList.appendChild(categoryContainer);
	})

}

async function getMoviesbyCategory(id) {
	headerCategoryTitle.innerHTML = '';
	genericSection.innerHTML = '';
	const { data } = await api('discover/movie?hitk_genres=', {
		params: {
			with_genres: id
		}
	});
	const movies = data.results;

	const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es`);
	const categoriesData = await res.json();
	const categories = categoriesData.genres
	const { name } = categories.find(c => c.id == id)
	const nameMovie = document.createTextNode(name)
	headerCategoryTitle.appendChild(nameMovie);

	movies.forEach(movie => {
		const movieContainer = document.createElement('div');
		movieContainer.classList.add('movie-container');

		const movieImg = document.createElement('img')
		movieImg.classList.add('movie-img');
		movieImg.setAttribute('alt', movie.title);
		movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`)

		movieContainer.appendChild(movieImg);
		genericSection.appendChild(movieContainer);
	})


}
