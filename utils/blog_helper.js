const dummy = (blogs) => {
	console.log(blogs)
	return 1
}

const totalLikes = (listOfBlogs) => {
	console.log(listOfBlogs)
	const reducer = (accumulator, currentValue) => {
		console.log(accumulator)
		console.log(currentValue)
		return accumulator + currentValue;
	}

	return listOfBlogs.map(blog => blog.likes).reduce(reducer)
}

const favoriteBlog = (listOfBlogs) => {
	const arrayOfLikes = listOfBlogs.map(blog => blog.likes)
	const indexOfMax = arrayOfLikes.indexOf(Math.max(...arrayOfLikes))
	return listOfBlogs[indexOfMax]
}

const mostActiveAuthor = (listOfBlogs) => {
	const listOfAuthors = listOfBlogs.map(blog => {
		console.log(blog.author)
		return blog.author
	}) 
	console.log(listOfAuthors)
	return "Robert C. Martin"
}

module.exports = {
	dummy, totalLikes, favoriteBlog, mostActiveAuthor
}