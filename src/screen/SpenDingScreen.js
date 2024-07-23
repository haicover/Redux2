import React, {useState, useEffect} from 'react';
import {
  Button,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addSpenDing,
  deleteSpenDing,
  updateSpenDing,
  fetchSpendings,
} from '../redux/reducers/SpenDingReducer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
const SpenDingScreen = () => {
  const [title, setTitle] = useState('');
  const [mota, setMota] = useState('');
  const [ngaythu, setNgaythu] = useState('');
  const [ngaychi, setNgaychi] = useState('');
  const [dateText, setDateText] = useState('');
  const [loaithuchi, setLoaithuchi] = useState(true);
  const [sotien, setSotien] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [idEdit, setIdEdit] = useState(null);
 const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
 const [currentDateType, setCurrentDateType] = useState('');
  const listSpenDing = useSelector(state => state.listSpenDing.listSpenDing);
  const dispatch = useDispatch();

  const clearInputs = () => {
    setTitle('');
    setMota('');
    setNgaythu('');
    setNgaychi('');
    setLoaithuchi(true);
    setSotien('');
  };

  const handleAddSpenDing = () => {
    const newSpenDing = {
      id: Math.random().toString(),
      title,
      mota,
      ngaythu,
      ngaychi,
      loaithuchi,
      sotien: parseFloat(sotien),
    };
    dispatch(addSpenDing(newSpenDing));
    clearInputs();
    setModalVisible(false);
  };

  const handleDeleteSpenDing = id => {
    dispatch(deleteSpenDing(id));
  };

  const handleEdit = spending => {
    setTitle(spending.title);
    setMota(spending.mota);
    setNgaythu(spending.ngaythu);
    setNgaychi(spending.ngaychi);
    setLoaithuchi(spending.loaithuchi);
    setSotien(spending.sotien);
    setIdEdit(spending.id);
    setModalVisibleEdit(true);
  };

  const handleUpdateSpenDing = () => {
    const updatedSpenDing = {
      id: idEdit,
      title,
      mota,
      ngaythu,
      ngaychi,
      loaithuchi,
      sotien: parseFloat(sotien),
    };
    dispatch(updateSpenDing(updatedSpenDing));
    clearInputs();
    setIdEdit(null);
    setModalVisibleEdit(false);
  };
  const handleDateConfirm = date => {
    if (date && date instanceof Date) {
      const formattedDate = date.toLocaleDateString(); // Adjust the format as needed
      if (currentDateType === 'ngaythu') {
        setNgaythu(formattedDate);
      } else if (currentDateType === 'ngaychi') {
        setNgaychi(formattedDate);
      }
      setDateText(formattedDate);
    } else {
      console.warn('Invalid date received');
    }
    setIsDatePickerVisible(false);
  };

  const totalIncome = listSpenDing.reduce(
    (total, item) => (item.loaithuchi ? total + item.sotien : total),
    0,
  );
  const totalExpense = listSpenDing.reduce(
    (total, item) => (!item.loaithuchi ? total + item.sotien : total),
    0,
  );

  const filteredSpending = listSpenDing.filter(item =>
    item.title.toLowerCase().includes(searchKeyword.toLowerCase()),
  );
  useEffect(() => {
    dispatch(fetchSpendings());
  }, [dispatch]);
  return (
    <View style={{flex: 1, padding: 20}}>
      <TextInput
        placeholder="Tìm kiếm theo tiêu đề"
        value={searchKeyword}
        onChangeText={setSearchKeyword}
        style={{
          borderWidth: 1,
          borderColor: 'black',
          margin: 10,
          borderRadius: 10,
          padding: 10,
        }}
      />

      <Text style={{margin: 10}}>Tổng số tiền thu: {totalIncome}</Text>
      <Text style={{margin: 10}}>Tổng số tiền chi: {totalExpense}</Text>
      <ScrollView style={{marginTop: 20, marginBottom: 30}}>
        {filteredSpending.map(spending => (
          <View
            key={spending.id}
            style={{
              padding: 10,
              margin: 10,
              backgroundColor: '#aeaeae',
              borderWidth: 1,
              borderRadius: 10,
              flexDirection: 'row',
            }}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Text>Tiêu đề: {spending.title}</Text>
              <Text>Mô tả: {spending.mota}</Text>
              <Text>Ngày thu: {spending.ngaythu}</Text>
              <Text>Ngày chi: {spending.ngaychi}</Text>
              <Text>Loại: {spending.loaithuchi ? 'Thu' : 'Chi'}</Text>
              <Text>Số tiền: {spending.sotien}</Text>
            </View>
            <View
              style={{flexDirection: 'column', justifyContent: 'space-evenly'}}>
              <TouchableOpacity
                onPress={() => handleEdit(spending)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 50,
                  height: 30,
                  backgroundColor: 'blue',
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                  }}>
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteSpenDing(spending.id)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 50,
                  height: 30,
                  backgroundColor: 'red',
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                  }}>
                  Xóa
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}>
        <Icon name="add" size={30} color="#FFf" />
      </TouchableOpacity>
      {/* Modal add */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                marginBottom: 10,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Thêm quản lý chi tiêu
            </Text>
            <TextInput
              placeholder="Nhập tên sản phẩm"
              value={title}
              onChangeText={setTitle}
              style={{borderWidth: 1, borderColor: 'black', margin: 10}}
            />
            <View
              style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
              <TextInput
                style={{flex: 1, borderWidth: 1, borderColor: 'black'}}
                placeholder="Ngày thu"
                value={ngaythu}
                editable={false}
              />
              <TouchableOpacity
                onPress={() => {
                  setCurrentDateType('ngaythu');
                  setIsDatePickerVisible(true);
                }}
                style={{padding: 10}}>
                <Icon name="calendar-month" size={25} color="black" />
              </TouchableOpacity>
            </View>
            <View
              style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
              <TextInput
                style={{flex: 1, borderWidth: 1, borderColor: 'black'}}
                placeholder="Ngày chi"
                value={ngaychi}
                editable={false}
              />
              <TouchableOpacity
                onPress={() => {
                  setCurrentDateType('ngaychi');
                  setIsDatePickerVisible(true);
                }}
                style={{padding: 10}}>
                <Icon name="calendar-month" size={25} color="black" />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Nhập số tiền"
              value={sotien}
              onChangeText={setSotien}
              keyboardType="numeric"
              style={{borderWidth: 1, borderColor: 'black', margin: 10}}
            />
            <TextInput
              placeholder="Nhập mô tả"
              value={mota}
              onChangeText={setMota}
              style={{borderWidth: 1, borderColor: 'black', margin: 10}}
            />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => setLoaithuchi(true)}
                style={{
                  margin: 10,
                  padding: 10,
                  backgroundColor: loaithuchi ? 'blue' : 'grey',
                  borderRadius: 10,
                }}>
                <Text style={{color: 'white'}}>Thu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLoaithuchi(false)}
                style={{
                  margin: 10,
                  padding: 10,
                  backgroundColor: !loaithuchi ? 'blue' : 'grey',
                  borderRadius: 10,
                }}>
                <Text style={{color: 'white'}}>Chi</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 50,
                  height: 30,
                  backgroundColor: 'blue',
                  borderRadius: 10,
                }}>
                <Text style={{textAlign: 'center', color: 'white'}}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (idEdit) {
                    handleUpdateSpenDing();
                  } else {
                    handleAddSpenDing();
                  }
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 50,
                  height: 30,
                  backgroundColor: 'blue',
                  borderRadius: 10,
                }}>
                <Text style={{textAlign: 'center', color: 'white'}}>
                  {idEdit ? 'Sửa' : 'Thêm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal edit */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleEdit}
        onRequestClose={() => setModalVisibleEdit(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                marginBottom: 10,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Sửa quản lý chi tiêu
            </Text>
            <TextInput
              placeholder="Nhập tên sản phẩm"
              value={title}
              onChangeText={setTitle}
              style={{borderWidth: 1, borderColor: 'black', margin: 10}}
            />
            <View
              style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
              <TextInput
                style={{flex: 1, borderWidth: 1, borderColor: 'black'}}
                placeholder="Ngày thu"
                value={ngaythu}
                editable={false}
              />
              <TouchableOpacity
                onPress={() => {
                  setCurrentDateType('ngaythu');
                  setIsDatePickerVisible(true);
                }}
                style={{padding: 10}}>
                <Icon name="calendar-month" size={25} color="black" />
              </TouchableOpacity>
            </View>
            <View
              style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
              <TextInput
                style={{flex: 1, borderWidth: 1, borderColor: 'black'}}
                placeholder="Ngày chi"
                value={ngaychi}
                editable={false}
              />
              <TouchableOpacity
                onPress={() => {
                  setCurrentDateType('ngaychi');
                  setIsDatePickerVisible(true);
                }}
                style={{padding: 10}}>
                <Icon name="calendar-month" size={25} color="black" />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Nhập số tiền"
              value={sotien}
              onChangeText={setSotien}
              keyboardType="numeric"
              style={{borderWidth: 1, borderColor: 'black', margin: 10}}
            />
            <TextInput
              placeholder="Nhập mô tả"
              value={mota}
              onChangeText={setMota}
              style={{borderWidth: 1, borderColor: 'black', margin: 10}}
            />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => setLoaithuchi(true)}
                style={{
                  margin: 10,
                  padding: 10,
                  backgroundColor: loaithuchi ? 'blue' : 'grey',
                  borderRadius: 10,
                }}>
                <Text style={{color: 'white'}}>Thu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLoaithuchi(false)}
                style={{
                  margin: 10,
                  padding: 10,
                  backgroundColor: !loaithuchi ? 'blue' : 'grey',
                  borderRadius: 10,
                }}>
                <Text style={{color: 'white'}}>Chi</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity
                onPress={() => setModalVisibleEdit(false)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 50,
                  height: 30,
                  backgroundColor: 'red',
                  borderRadius: 10,
                }}>
                <Text style={{textAlign: 'center', color: 'white'}}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleUpdateSpenDing()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 50,
                  height: 30,
                  backgroundColor: 'blue',
                  borderRadius: 10,
                }}>
                <Text style={{textAlign: 'center', color: 'white'}}>Sửa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setIsDatePickerVisible(false)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  addButton: {
    width: 50,
    height: 50,
    position: 'absolute',
    backgroundColor: 'red',
    bottom: 10,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
});
export default SpenDingScreen;
