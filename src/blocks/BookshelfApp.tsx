import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import { useState } from 'react';
import axios from 'axios';
import { ChevronRight, Search } from 'react-feather';

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

interface BookDetailProps {
  title: string;
  author: string;
  coverImage: string;
}

interface BookshelfProps {
  done: (data: BlockModel) => void;
  model: BlockModel;
}

const BookDetail: React.FC<BookDetailProps> = ({ title, author, coverImage }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#f5f1e7] p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl text-[#5a2b1e] mb-2">{title}</h1>
        <p className="text-lg text-[#8b6d61]">{author}</p>
      </div>
      <div className="w-48 h-auto shadow-lg">
        <img src={coverImage} alt={title} className="w-full h-full object-cover rounded" />
      </div>
      <div className="mt-4 w-10 h-1 bg-[#5a2b1e] rounded"></div>
    </div>
  );
};

const Bookshelf: React.FC<BookshelfProps> = ({ done, model }) => {
  const [query, setQuery] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);

  const searchBooks = async () => {
    if (query) {
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
        setBooks(response.data.items || []);
      } catch (error) {
        console.error('Error fetching data from Google Books API', error);
      }
    }
  };

  return (
    <div className="p-6 bg-[#f5f1e7] min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl text-[#5a2b1e]">Bookshelf</h1>
      </div>
      <p className="text-center text-[#5a2b1e] mb-6">Add a book to your shelf</p>
      <div className="relative mb-4 flex items-center">
        <Search />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchBooks();
          }}
          className="flex"
        >
          <input
            type="text"
            className="w-full p-2 pl-10 border-b border-[#5a2b1e] bg-transparent placeholder-[#5a2b1e] text-[#5a2b1e] focus:outline-none"
            placeholder="Add a book to your shelf"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="text-white bg-[#5a2b1e] px-4 py-2 rounded ml-2"
          >
            Search
          </button>
        </form>
      </div>
      <div>
        {books.length > 0 && (
          <ul>
            {books.map((book) => (
              <li key={book.id} className="mb-4 flex items-center" onClick={() => {
                console.log(book);
                model.data['title'] = book.volumeInfo.title;
                model.data['author'] = book.volumeInfo.authors?.join(', ') ?? "Unknown Author";
                model.data['coverImage'] = book.volumeInfo.imageLinks?.thumbnail ?? "unknown image";
                done(model);
              }}>
                {book.volumeInfo.imageLinks?.thumbnail && (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title}
                    className="w-12 h-16 mr-4 rounded shadow"
                  />
                )}
                <div>
                  <h2 className="text-xl text-[#5a2b1e]">{book.volumeInfo.title}</h2>
                  <p className="text-[#8b6d61]">{book.volumeInfo.authors?.join(', ')}</p>
                </div>
                <ChevronRight className='ml-auto' />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default class BookshelfBlock extends Block {
  render() {
    return (
     <BookDetail title={this.model.data['title']} author={this.model.data['author']} coverImage={this.model.data['coverImage']} />
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <Bookshelf done={done} model={this.model}/>
    )
  }
}