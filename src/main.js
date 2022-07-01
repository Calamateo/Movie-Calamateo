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

const createMovies = async (movies, container) => {
	container.innerHTML = "";

	movies.forEach(movie => {
		const movieContainer = document.createElement('div');
		movieContainer.classList.add('movie-container');
		movieContainer.addEventListener('click', () => {
			location.hash = `movie=${movie.id}`;
		})

		const movieImg = document.createElement('img')
		movieImg.classList.add('movie-img');
		movieImg.setAttribute('alt', movie.title);
		movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300${movie.poster_path}`)

		movieContainer.appendChild(movieImg);
		container.appendChild(movieContainer);
	})
}

const createCategories = async (categories, container) => {
	container.innerHTML = "";

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
		container.appendChild(categoryContainer);
	})
}


async function getTrendingMoviesPreview() {
	const { data } = await api('trending/movie/day');
	const movies = data.results;
	createMovies(movies, trendingMoviesPreviewList);
	console.log(movies)
}

async function getCategoriesPreview() {
	const { data } = await api(`genre/movie/list`);
	const categories = data.genres;

	createCategories(categories, categoriesPreviewList)

}

async function getMoviesbyCategory(id) {
	headerCategoryTitle.innerHTML = '';
	const { data } = await api('discover/movie?hitk_genres=', {
		params: {
			with_genres: id
		}
	});
	const movies = data.results;
	createMovies(movies, genericSection);
	const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es`);
	const categoriesData = await res.json();
	const categories = categoriesData.genres
	const { name } = categories.find(c => c.id == id)
	const nameMovie = document.createTextNode(name)
	headerCategoryTitle.appendChild(nameMovie);

}

const getMoviesBySearch = async (searchValue) => {
	const { data } = await api(`search/movie`, {
		params: {
			query: searchValue,
		}
	})
	const nameMovie = document.createTextNode(searchValue)
	headerCategoryTitle.innerHTML = ""
	headerCategoryTitle.appendChild(nameMovie)
	createMovies(data.results, genericSection)
}

const getTrendingMovies = async () => {
	const { data } = await api('trending/all/day')
	createMovies(data.results, genericSection)
	headerCategoryTitle.innerHTML = ""
	const nameMovie = document.createTextNode('Tendencias')
	headerCategoryTitle.appendChild(nameMovie);
}

const getMovieDetails = async (movie_id) => {
	const { data: movie } = await api(`movie/${movie_id}`)

	const movieImgURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
	headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieImgURL})`
	movieDetailDescription.textContent = movie.overview;
	movieDetailTitle.textContent = movie.title;
	movieDetailScore.textContent = movie.vote_average;
	createCategories(movie.genres, movieDetailCategoriesList)
}

const relatedMovies = async (movie_id) => {
	const { data: movie } = await api(`movie/${movie_id}/recommendations`)

	createMovies(movie.results, relatedMoviesContainer)
	relatedMoviesContainer.scrollTo(0, 0);
}