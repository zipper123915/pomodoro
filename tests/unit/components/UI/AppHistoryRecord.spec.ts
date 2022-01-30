// @ts-ignore
import AppHistoryRecord from '@/components/UI/AppHistoryRecord'
import { mount, VueWrapper } from '@vue/test-utils'
import { HistoryRecord } from '../../../../models/history-record.model'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'
import firebase from 'firebase/compat'
import { Task } from '../../../../models/task.model'

describe('AppHistoryRecord component', () => {
  let wrapper: VueWrapper<AppHistoryRecord>

  const ownerId = nanoid()
  const tasks: Task[] = [
    {
      id: nanoid(),
      ownerId,
      status: 'completed',
      updatedAt: firebase.firestore.Timestamp.fromDate(dayjs().toDate()),
      createdAt: firebase.firestore.Timestamp.fromDate(dayjs().toDate()),
      timeCompleted: firebase.firestore.Timestamp.fromDate(dayjs().subtract(13, 'm').toDate()),
      order: 0,
      text: 'some time'
    },
    {
      id: nanoid(),
      ownerId,
      status: 'completed',
      updatedAt: firebase.firestore.Timestamp.fromDate(dayjs().toDate()),
      createdAt: firebase.firestore.Timestamp.fromDate(dayjs().toDate()),
      timeCompleted: firebase.firestore.Timestamp.fromDate(dayjs().subtract(25, 'm').toDate()),
      order: 1,
      text: 'some time'
    },
    {
      id: nanoid(),
      ownerId,
      status: 'completed',
      updatedAt: firebase.firestore.Timestamp.fromDate(dayjs().toDate()),
      createdAt: firebase.firestore.Timestamp.fromDate(dayjs().toDate()),
      timeCompleted: firebase.firestore.Timestamp.fromDate(dayjs().subtract(22, 'm').toDate()),
      order: 2,
      text: 'some time'
    }
  ]
  const record: HistoryRecord = {
    id: nanoid(),
    ownerId,
    isBreak: false,
    timeStart: firebase.firestore.Timestamp.fromDate(dayjs().subtract(35, 'm').toDate()),
    timeEnd: firebase.firestore.Timestamp.fromDate(dayjs().toDate())
  }

  beforeEach(() => {
    wrapper = mount(AppHistoryRecord, {
      props: {
        record,
        tasks
      }
    })
  })

  it('should keep structure', () => {
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('history-item')
  })

  it('should change template when isBreak is true', async () => {
    expect(!('history-item--break' in wrapper.classes())).toBeTruthy()
    expect(wrapper.find('.history-item__tasks').exists()).toBeTruthy()

    await wrapper.setProps({
      record: {
        ...record,
        isBreak: true
      }
    })

    expect(wrapper.classes()).toContain('history-item--break')
    expect(wrapper.find('.history-item__tasks').exists()).toBeFalsy()
  })

  it('should have duration', async () => {
    const duration = wrapper.find('.history-item__duration')
    expect(duration.exists()).toBeTruthy()

    expect(duration.text()).toBe('35 min')
    await wrapper.setProps({
      record: {
        ...record,
        timeStart: firebase.firestore.Timestamp.fromDate(dayjs().subtract(3, 'h').toDate())
      }
    })
    expect(duration.text()).toBe('3 hours')

    await wrapper.setProps({
      record: {
        ...record,
        timeStart: firebase.firestore.Timestamp.fromDate(dayjs().subtract(3, 's').toDate())
      }
    })
    expect(duration.text()).toBe('')
  })

  it('should have time interval', async () => {
    const interval = wrapper.find('.history-item__time')
    expect(interval.exists()).toBeTruthy()

    const timeStartFormatted = dayjs(record.timeStart.toDate()).format('HH:mm')
    const timeEndFormatted = dayjs(record.timeEnd?.toDate()).format('HH:mm')
    expect(interval.text()).toBe(`${timeStartFormatted} - ${timeEndFormatted}`)
  })
})
