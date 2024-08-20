import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types'
import './BlockStyles.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronRight, Search } from 'react-feather';
import { loadFont } from './utils/Fonts';

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
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadFont("Cormorant Garamond").then(() => {
      setFontLoaded(true);
    })
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#F1ECE6] p-6">
      <div className="text-center pb-6">
        <h1 className="text-[#57231E] pb-2" style={fontLoaded ? { fontFamily: "Cormorant Garamond, serif" } : {}}>{title}</h1>
        <p style={fontLoaded ? { fontFamily: "Cormorant Garamond, serif", color: 'rgba(0, 0, 0, 0.60)', fontSize: "20px" } : {}}>{author}</p>
      </div>
      <div className="w-48 h-auto shadow-lg">
        <img src={coverImage} alt={title} className="w-full h-full object-cover rounded" />
      </div>
      <div className="mt-12 mb-16 w-16 h-2 bg-[#D5D1CA] rounded"></div>
    </div>
  );
};

const Bookshelf: React.FC<BookshelfProps> = ({ done, model }) => {
  const [query, setQuery] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadFont("Cormorant Garamond").then(() => {
      setFontLoaded(true);
    })
  }, []);

  useEffect (() => {
    document.body.style.backgroundColor = "#F1ECE6";

    return () => {
      document.body.style.backgroundColor = "#FFFFFF";
    }
  })

  const searchBooks = async () => {
    if (query && query.length > 0) {
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
        setBooks(response.data.items || []);
      } catch (error) {
        console.error('Error fetching data from Google Books API', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      searchBooks();
    }, 500);

    setDebounceTimeout(timeout);
  };

  return (
    <div className="bg-[#F1ECE6] h-full">
      <div className="flex items-center justify-center mb-8 pt-[50px]">
        <h2 className="text-2xl text-[#57231E]" style={fontLoaded ? { fontFamily: "Cormorant Garamond, serif" } : {}}>Bookshelf</h2>
      </div>
      <p className="text-center text- mb-6 text-xl" style={fontLoaded ? { fontFamily: "Cormorant Garamond, serif", color: 'rgba(0, 0, 0, 0.60)' } : {}}>Add a book to your shelf</p>
      <div className="relative pl-6 flex items-center">
        <Search color="#5a2b1e" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchBooks();
          }}
          className="flex"
        >
          <input
            type="text"
            className="w-full p-2 bg-transparent placeholder-[#5a2b1e] text-[#5a2b1e] focus:outline-none"
            style={{ fontSize: '32px', fontFamily: "Cormorant Garamond" }}
            value={query}
            onChange={handleInputChange}
            autoFocus={true}
          />
        </form>
      </div>
      <div className="p-4 bg-[#F1ECE6]">
        {books.length > 0 && (
          <ul>
            {books.map((book) => (
              <li key={book.id} className="mb-4 flex items-center" onClick={() => {
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
                  <h3>{book.volumeInfo.title}</h3>
                  <p style={{color: "rgba(0, 0, 0, 0.60)"}}>{book.volumeInfo.authors?.join(', ')}</p>
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

export const BookshelfFeedComponent = ({ model }: FeedComponentProps) => {
  return (
    <BookDetail title={model.data['title']} author={model.data['author']} coverImage={model.data['coverImage']} />
   );
}

export const BookshelfComposerComponent = ({ model, done }: ComposerComponentProps) => {
  return (
    <Bookshelf done={done} model={model}/>
  )
}