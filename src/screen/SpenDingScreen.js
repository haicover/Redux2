import React, {useState, useEffect} from 'react';
import {
  Button,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addSpenDing,
  deleteSpenDing,
  updateSpenDing,
  fetchSpendings,
} from '../redux/reducers/SpenDingReducer';

const SpenDingScreen = () => {
  const [title, setTitle] = useState('');
  const [mota, setMota] = useState('');
  const [ngaythu, setNgaythu] = useState('');
  const [ngaychi, setNgaychi] = useState('');
  const [loaithuchi, setLoaithuchi] = useState(true);
  const [sotien, setSotien] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [idEdit, setIdEdit] = useState(null);

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
    setSotien(spending.sotien.toString());
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
    console.log('List of spendings:', listSpenDing);
    dispatch(fetchSpendings());
  }, [dispatch]);
  return (
    <View style={{flex: 1, padding: 20}}>
      <Button title="Thêm" onPress={() => setModalVisible(true)} />
      <TextInput
        placeholder="Tìm kiếm theo tiêu đề"
        value={searchKeyword}
        onChangeText={setSearchKeyword}
        style={{borderWidth: 1, borderColor: 'black', margin: 10}}
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
              backgroundColor: 'cyan',
              borderWidth: 1,
              borderRadius: 10,
            }}>
            <Text>Tiêu đề: {spending.title}</Text>
            <Text>Mô tả: {spending.mota}</Text>
            <Text>Ngày thu: {spending.ngaythu}</Text>
            <Text>Ngày chi: {spending.ngaychi}</Text>
            <Text>Loại: {spending.loaithuchi ? 'Thu' : 'Chi'}</Text>
            <Text>Số tiền: {spending.sotien}</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity
                onPress={() => handleEdit(spending)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 50,
                  height: 30,
                  backgroundColor: 'yellow',
                  borderRadius: 10,
                }}>
                <Text style={{textAlign: 'center'}}>Edit</Text>
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
                <Text style={{textAlign: 'center', color: 'white'}}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

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
            <TextInput
              placeholder="Nhập ngày thu "
              value={ngaythu}
              onChangeText={setNgaythu}
              style={{borderWidth: 1, borderColor: 'black', margin: 10}}
            />
            <TextInput
              placeholder="Nhập ngày chi"
              value={ngaychi}
              onChangeText={setNgaychi}
              style={{borderWidth: 1, borderColor: 'black', margin: 10}}
            />
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
                  backgroundColor: loaithuchi ? 'green' : 'grey',
                  borderRadius: 10,
                }}>
                <Text style={{color: 'white'}}>Thu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLoaithuchi(false)}
                style={{
                  margin: 10,
                  padding: 10,
                  backgroundColor: !loaithuchi ? 'red' : 'grey',
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
                  backgroundColor: 'red',
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
                  backgroundColor: 'green',
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
            <TextInput
              placeholder="Nhập ngày thu"
              value={ngaythu}
              onChangeText={setNgaythu}
              style={{borderWidth: 1, borderColor: 'black', margin: 10}}
            />
            <TextInput
              placeholder="Nhập ngày chi"
              value={ngaychi}
              onChangeText={setNgaychi}
              style={{borderWidth: 1, borderColor: 'black', margin: 10}}
            />
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
                  backgroundColor: loaithuchi ? 'green' : 'grey',
                  borderRadius: 10,
                }}>
                <Text style={{color: 'white'}}>Thu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLoaithuchi(false)}
                style={{
                  margin: 10,
                  padding: 10,
                  backgroundColor: !loaithuchi ? 'red' : 'grey',
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
                  backgroundColor: 'green',
                  borderRadius: 10,
                }}>
                <Text style={{textAlign: 'center', color: 'white'}}>Sửa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SpenDingScreen;
