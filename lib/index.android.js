import React, { useEffect, useState, useMemo } from "react"
import { StyleSheet, Text, TouchableOpacity, View, TextInput, FlatList } from "react-native"
import Modal from "react-native-modal"

const ReactNativePickerModule = ({
  pickerRef,
  value,
  items,
  title,
  onValueChange,
  cancelButton,
  confirmButton,
  onCancel,
  contentContainerStyle,
  titleStyle,
  itemStyle,
  useNativeDriver,
  confirmButtonDisabledTextStyle,
  confirmButtonEnabledTextStyle,
  cancelButtonTextStyle,
  backdropColor,
  backdropOpacity,
  selectedColor,
  confirmButtonStyle,
  cancelButtonStyle,
  hasFilter,
  filterPlaceholder,
  filterStyle,
}) => {
  const dismissPress = () => {
    setIsVisible(false)
    if (onCancel) {
      onCancel()
    }
  }
  const [isVisible, setIsVisible] = useState(false)
  const [selectedValue, setSelectedValue] = useState()
  const [filter, setFilter] = useState('')
  const setDefaultSelectedValue = () => setSelectedValue(
    !value ? (typeof items[0] === "object" ? items[0].value : items[0]) : value,
  )
  useEffect(() => {
    pickerRef.current = {
      show: () => setIsVisible(true),
      hide: dismissPress,
    }
  })
  const filteredItems = useMemo(() => {
    let loweredFilter = filter.toLowerCase();
    return items.filter((item) => {
      let filteredItem = (item.hasOwnProperty("label") ? item.label.toString() : item.toString()).toLowerCase();
      return filteredItem.includes(loweredFilter)
    })
  }, [items, filter])
  const renderItem = ({item}) => {
    return <TouchableOpacity
      onPress={() => setSelectedValue(item.value)}>
      <Text style={[styles.item, itemStyle, {color: (value === item.value || selectedValue === item.value) ? selectedColor : '#707070'}]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  }
  return (
    <Modal
      backdropColor={backdropColor}
      backdropOpacity={backdropOpacity}
      onBackdropPress={dismissPress}
      onBackButtonPress={dismissPress}
      onShow={setDefaultSelectedValue}
      useNativeDriver={useNativeDriver}
      isVisible={isVisible}
      style={{ justifyContent: "flex-end" }}
      hideModalContentWhileAnimating={true}>
      <View style={[styles.content, contentContainerStyle]}>
        <View style={styles.titleView}>
          <Text style={[styles.titleText, titleStyle]}>{title}</Text>
        </View>
        {hasFilter && (
          <TextInput
            placeholder={filterPlaceholder}
            style={[styles.input, filterStyle]}
            onChangeText={setFilter}
          />
          )
        }
        <FlatList
          data={filteredItems.map((item, index) => {
            return {
              label: item.hasOwnProperty("label") ? item.label.toString() : item.toString(),
              value: item.hasOwnProperty("value") ? item.value.toString() : item.toString(),
              id: index.toString(),
            }
          })}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          style={{ maxHeight: 400, marginVertical: 25 }} />
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={value === selectedValue}
          onPress={() => {
            onValueChange(selectedValue)
            setIsVisible(false)
            setFilter('')
          }}
          style={[styles.confirmButtonView, confirmButtonStyle]}>
          <Text
            style={[
              styles.confirmButtonText,
              selectedValue === value ? confirmButtonDisabledTextStyle : confirmButtonEnabledTextStyle,
            ]}>
            {confirmButton}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cancelButton}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.cancelButtonView, cancelButtonStyle]}
          onPress={dismissPress}>
          <Text style={[styles.cancelButtonText, cancelButtonTextStyle]}>{cancelButton}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  confirmButtonView: {
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "rgba(165,165,165,0.2)",
    paddingVertical: 15,
  },
  confirmButtonText: {
    fontWeight: "500",
    fontSize: 18,
    textAlign: "center",
  },
  cancelButton: {
    marginVertical: 10,
  },
  cancelButtonView: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
  },
  cancelButtonText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    color: "rgba(0,122,255,1)",
  },
  titleView: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(165,165,165,0.2)",
  },
  titleText: {
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
    color: "#bdbdbd",
  },
  item: {
    paddingHorizontal: 25,
    paddingVertical: 12,
  },
  input: {
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 25,
    marginTop: 15,
    fontSize: 16,
  }
})

ReactNativePickerModule.defaultProps = {
  confirmButtonEnabledTextStyle: {
    color: "rgba(0,122,255,1)",
  },
  confirmButtonDisabledTextStyle: {
    color: "rgba(0,0,0,0.2)",
  },
  cancelButton: "Cancel",
  confirmButton: "Confirm",
  useNativeDriver: true,
}

export default ReactNativePickerModule
