import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import Toast from '../components/Toast'
import EmptyCard from '../components/EmptyCard'
import addNote from "../assets/add-note.svg"
import noData from "../assets/no-data.svg"

const Home = () => {

  
  const [showToast, setShowToast] = useState({
    isShown:false,
    message:'',
    type:'add'
  })
  const [userInfo, setUserInfo] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [allNotes, setAllNotes] = useState([]);

  const [isSearch, setIsSearch] = useState(false);


  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown:true, data: noteDetails, type:"edit"});
  };



  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  });

  //get user Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/api/user/get-user');

      if (response.data && response.data.user) {
        // console.log(response);
        setUserInfo(response.data.user);
      } else {
        console.error("User data not found in response", response.data);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401 || 404 || 403) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };



  //get all notes API call

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/api/notes/');
      // console.log('API Response:', response);
      if (response.data && response.data.notes) {
        // console.log('Setting allNotes with:', response.data.notes);
        setAllNotes(response.data.notes);
      } else {
        console.warn('No notes found in response');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  // console.log(allNotes);

  //Toast
  const showToastMessage = (message, type ) => {
    setShowToast({
      isShown: true,
      message: message,
      type: type
  });
  }

  const handleCloseToast = () => {
    setShowToast({
      isShown:false,
      message: ''
    });

  }

  const deleteNote = async (data) => {
    const noteId = data._id;
        try {
            const response = await axiosInstance.delete("/api/notes/delete/" + noteId);
            // console.log(response.data);

            if (response.data) {
                showToastMessage("Note Deleted successfully.","delete");
                getAllNotes();
            };

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.log(`An Unexpected error occured`);
            }


        };
  }

  const pinNote = async (data) => {
    const noteId = data._id;
        try {
            const response = await axiosInstance.put("/api/notes/pin/" + noteId, {isPinned: !data.isPinned});
            // console.log(response.data);

            if (response.data) {
                showToastMessage("Note pinned successfully.");
                getAllNotes();
            };

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.log(`An Unexpected error occured`);
            }


        };
  }

  const onSearchNote = async (query) => {
    try{
      const response = await axiosInstance.get("/api/notes/search/",{
        params: {query},
      });

      if (response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    }catch(error){
      console.log(error)
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  }

  return (

    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

      <div className="container mx-auto px-4 sm:px-6 py-6 pb-24 min-h-[calc(100vh-72px)]">
        {allNotes.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
          {allNotes && allNotes.map((item, index) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={item.createdOn}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => deleteNote(item)}
              onPinNote={() => pinNote(item)}
            />
          ))}  
        </div>
        ): (
          <EmptyCard imgSrc={isSearch ? noData : addNote} message={isSearch ? "Oops No data found." : "There are no notes present, click the + to create a note"}/>
        )
}
      </div>

      <button className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-primary hover:bg-blue-600 absolute right-4 bottom-4 sm:right-10 sm:bottom-10" onClick={() => {
        setOpenAddEditModal({
          isShown: true,
          type: "add",
          data: null
        })
      }}>
        <MdAdd className='text-[32px] text-white' />
      </button>


      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }
        }}
        contentLabel=""
        className="w-full max-w-3xl sm:w-[90%] md:w-[80%] lg:w-[40%] max-h-[85vh] bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll-hidden"
      >

        <AddEditNotes
          onClose={() => { setOpenAddEditModal({ isShown: false, type: "add", data: null }) }}
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />

      </Modal>

      <Toast
      isShown={showToast.isShown}
      message={showToast.message}
      type={showToast.type}
      onClose={handleCloseToast}/>

    </>
  )
}

export default Home