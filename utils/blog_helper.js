const dummy = (blogs) => {
	console.log(blogs)
	return 1
}

const totalLikes = (listWithOneBlog) => {
	console.log(listWithOneBlog)
	const reducer = (accumulator, currentValue) => {
		console.log(accumulator)
		console.log(currentValue)
		return accumulator + currentValue;
	}

	return listWithOneBlog.map(blog => blog.likes).reduce(reducer)
}

module.exports = {
	dummy, totalLikes
}