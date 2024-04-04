import { create } from 'zustand'
import { Data } from './types'

interface DataStore extends Data {

}

const useDataStore = create<DataStore>((set) => ({
  students: [],


}))