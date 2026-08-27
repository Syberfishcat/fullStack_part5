import { useState } from "react"
import blogService from '../services/blogs'

const NewBlog = ({onBlogCreated}) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleCreate = async event => {
        event.preventDefault()
        try {
            const createdBlog = await blogService.create({title, author, url})
            onBlogCreated(createdBlog)
        }catch(e) {
            console.log(e.message)
        }
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={handleCreate}>
                <div>
                    <label>
                        title:
                        <input
                            type='text'
                            value = {title}
                            onChange={({target}) => setTitle(target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        author:
                        <input
                            type='text'
                            value = {author}
                            onChange={({target}) => setAuthor(target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        url:
                        <input
                            type='text'
                            value = {url}
                            onChange={({target}) => setUrl(target.value)}
                        />
                    </label>
                </div>
                <button type='submit'>create</button>
            </form>
        </div>
    )
}

export default NewBlog