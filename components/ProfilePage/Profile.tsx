"use client";
import { auth, db } from '@/firebase.config';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import styles from './profilePage.module.scss';
import { useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { profilePicEdit, userIcon, edit, save } from '@/public/profile';
import { Close } from '@/public/productImages';

interface UserData {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  country: string;
  state: string;
  city: string;
  address: string;
  pincode: string;
  profilePicture: string;
}

interface InfoSectionProps {
  title: string;
  fields: { label: string; name: keyof UserData; type: string; options?: string[]; disabled?: boolean }[];
  formData: UserData;
  userData: UserData;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const personalInfoFields: { label: string; name: keyof UserData; type: string; options?: string[]; disabled?: boolean }[] = [
  { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other"] },
  { label: "Date of Birth", name: "dateOfBirth", type: "date" },
  { label: "Email", name: "email", type: "text", disabled: true },
  { label: "Phone Number", name: "phoneNumber", type: "tel" },
];

const addressSectionFields: { label: string; name: keyof UserData; type: string; options?: string[]; disabled?: boolean }[] = [
  { label: "Country", name: "country", type: "text" },
  { label: "State", name: "state", type: "text" },
  { label: "City", name: "city", type: "text" },
  { label: "Address", name: "address", type: "text" },
  { label: "Pincode", name: "pincode", type: "text" },
];

const InfoSection: React.FC<InfoSectionProps> = ({ title, fields, formData, userData, isEditing, handleChange }) => (
  <div className={styles.personalInfo}>
    <div className={styles.header}>
      <div className={styles.info}>{title}</div>
    </div>
    <div className={styles.details}>
      {fields.map(({ label, name, type, options, disabled }) => (
        <label key={name}>
          <p>{label}:</p>
          {isEditing ? (
            type === "select" ? (
              <select name={name} value={formData[name]} onChange={handleChange}>
                {options?.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : (
              <input type={type} name={name} value={formData[name]} onChange={handleChange} disabled={disabled} />
            )
          ) : (
            <span>{userData[name] || "Not Provided"}</span>
          )}
        </label>
      ))}
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, onAddOrUpdate, onRemove }: { isOpen: boolean, onClose: () => void, onAddOrUpdate: (file: File) => void, onRemove: () => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddOrUpdate(file);
    }
  };

  if (!isOpen) return null;
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Profile Picture Options</h2>
          <button onClick={onClose}><Image src={Close} alt='' height={10} width={10}/></button>
        </div>
        <div className={styles.actionButton}>

        <button className={styles.updateButton} onClick={() => fileInputRef.current?.click()}>Add/Update</button>
        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
        <button className={styles.removeButton} onClick={onRemove}>Remove</button>
        </div>
      </div>
    </div>
  );
};

export default function Profile() {
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "true";
  const [isEditing, setIsEditing] = useState<boolean>(editMode);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    country: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
    profilePicture: "",
  });

  const [formData, setFormData] = useState<UserData>(userData);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as UserData;
            setUserData({ ...data, email: user.email || "" });
            setFormData({ ...data, email: user.email || "" });
          } else {
            await setDoc(userRef, { ...userData, email: user.email || "" });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const user = auth.currentUser;
        if (user) {
          await updateProfile(user, { displayName: formData.name });

          const userRef = doc(db, "users", user.uid);
          await setDoc(userRef, formData);

          setUserData(formData);
          toast.success("Profile Updated Successfully!");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateProfilePicture = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, { profilePicture: base64String });
          setFormData((prev) => ({ ...prev, profilePicture: base64String }));
          setUserData((prev) => ({ ...prev, profilePicture: base64String }));
          toast.success("Profile Picture Updated Successfully!");
        } catch (error:unknown) {
          toast.error(`Error updating profile picture: ${String(error)}`);
        }
      }
    };
    reader.readAsDataURL(file);
    setIsModalOpen(false);
  };

  const handleRemoveProfilePicture = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { profilePicture: "" });
        setFormData((prev) => ({ ...prev, profilePicture: "" }));
        setUserData((prev) => ({ ...prev, profilePicture: "" }));
        toast.success("Profile Picture Removed Successfully!");
      } catch (error) {
        console.error("Error removing profile picture:", error);
      }
    }
    setIsModalOpen(false);
  };

  if (loading) return <p>Loading profile...</p>;
  if (!userData.email) return <p>No user is logged in. <Link href="/log-in">Go to Login</Link></p>;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.profileContainer}>
          <div className={styles.content}>
            <div className={styles.profileCard}>
              <div className={styles.card}>
                <div className={styles.editButton}>
                  <p>My Profile</p>
                  <button onClick={handleEditToggle}>
                    {isEditing ? (
                      <>
                        <Image src={save} alt="Save" title="Save" height={20} width={20} />
                        <span>Save</span>
                      </>
                    ) : (
                      <>
                        <Image src={edit} alt="Edit" title="Edit" height={20} width={20} />
                        <span>Edit</span>
                      </>
                    )}
                  </button>
                </div>
                <div className={styles.profileInfo}>
                  <div className={styles.imageContainer}>
                    <div className={styles.image}>
                      <Image
                        className={styles.img}
                        src={formData.profilePicture || userIcon}
                        alt="Profile Picture"
                        height={50}
                        width={50}
                      />
                    </div>
                    <button onClick={() => setIsModalOpen(true)}>
                      <Image className={styles.editImg} src={profilePicEdit} alt="Edit Icon" height={25} width={25} />
                    </button>
                  </div>
                  <div className={styles.nameSection}>
                    <label>
                      Name:
                      {isEditing ? (
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                      ) : (
                        <span>{" " + userData.name || "Not Provided"}</span>
                      )}
                    </label>
                  </div>
                </div>
                <InfoSection 
                  title="Personal Information" 
                  fields={personalInfoFields} 
                  formData={formData} 
                  userData={userData} 
                  isEditing={isEditing} 
                  handleChange={handleChange} 
                />
                <InfoSection 
                  title="Address Section" 
                  fields={addressSectionFields} 
                  formData={formData} 
                  userData={userData} 
                  isEditing={isEditing} 
                  handleChange={handleChange} 
                />
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddOrUpdate={handleAddOrUpdateProfilePicture} onRemove={handleRemoveProfilePicture} />
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </>
  );
}
