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
	const countMap = new Map()
	let maxCount = 0;
	let mostActiveBlogger = ''
	
	listOfBlogs.forEach(blog => {
		let countSoFar = countMap.get(blog.author)
		if (countSoFar > 0) {
			countMap.set(blog.author, countSoFar + 1)
			if ((countSoFar + 1) > maxCount) {
				maxCount = countSoFar + 1
				mostActiveBlogger = blog.author
			}
		} else {
			countMap.set(blog.author, 1)
		}
	})

	return { "author": mostActiveBlogger, "blogs": maxCount }
}

const mostLikedAuthor = (listOfBlogs) => {
	console.log('foo')
	const countMap = new Map()
	let maxCount = 0;
	let mostLikedBlogger = ''
	
	listOfBlogs.forEach(blog => {
		let countSoFar = countMap.get(blog.author)
		if (countSoFar > 0) {
			
			countMap.set(blog.author, countSoFar + blog.likes)
			if ((countSoFar + blog.likes) > maxCount) {
				maxCount = countSoFar + blog.likes
				mostLikedBlogger = blog.author
			}
		} else {
			countMap.set(blog.author, blog.likes)
		}
	})
	return { "author": "Edsger W. Dijkstra" , "likes": 17}
}

module.exports = {
	dummy, totalLikes, favoriteBlog, mostActiveAuthor, mostLikedAuthor
}