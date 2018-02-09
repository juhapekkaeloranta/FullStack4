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
			console.log('oli jo!')
			countMap.set(blog.author, countSoFar + 1)
			if ((countSoFar + 1) > maxCount) {
				maxCount = countSoFar + 1
				mostActiveBlogger = blog.author
				console.log('most active:', mostActiveBlogger)
			}
		} else {
			console.log('ee oo')
			countMap.set(blog.author, 1)
		}
	});

	console.log(countMap);
	return { "author": mostActiveBlogger, "blogs": maxCount }
}

module.exports = {
	dummy, totalLikes, favoriteBlog, mostActiveAuthor
}