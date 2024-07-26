import {test, expect} from '@playwright/test'
import { DemoPage } from '../pageObjectModels/demoPage';

test.beforeEach(async ({page}) => {
  let testPage = new DemoPage(page);
  await testPage.accessPage();
});

const todoList = ['buy coffee', 'wash dishes', 'clean shoes'];
const todoMvcURL = 'https://todomvc.com/';

test.describe('reachability', () => {
  test('check that URL is correct', async ({page}) => {
    await expect(page).toHaveURL(/playwright/);
  })
  
  test('check that title is correct', async ({page}) => {
    await expect(page).toHaveTitle(/Todo/);
  })
  
  test('check that footer buttons redirect to correct page', async({page}) => {
    let testPage = new DemoPage(page);
  
    await testPage.createdByLink.click();
    await expect(page).toHaveURL('https://github.com/remojansen/');
  
    await testPage.accessPage();
  
    await testPage.partOfLink.click();
    await expect(page).toHaveURL(todoMvcURL);
  })
  
  test('check that header button redirects to correct page', async({page}) => {
    let testPage = new DemoPage(page);
  
    await expect(testPage.headerLink).toHaveText('real TodoMVC app.');
    await testPage.headerLink.click();
    await expect(page).toHaveURL(todoMvcURL);
  })
})

test.describe('add and remove tasks', () => {
  test('check that tasks can be added in todo list', async ({page}) => {
    let testPage = new DemoPage(page); 
    await testPage.insertItemsInTodoList(todoList);

    const todoItems = await testPage.getTodoItems();
    for(let item of todoItems)
      await expect(item).toBeVisible();
  }); 
  
  test('check that tasks can be deleted', async ({page}) => {
    let testPage = new DemoPage(page);
  
    await testPage.insertItemsInTodoList(todoList);
    const itemCountBeforeDelete = await testPage.todoItemList.count();
  
    await testPage.clickFirstDeleteButton();
  
    const itemCountAfterDelete = await testPage.todoItemList.count();
    expect(itemCountAfterDelete).toBeLessThan(itemCountBeforeDelete);
  });
})

test.describe('check footer of todo modal', () => {
  test('check nr of items added in todoList', async({page}) => {
    let testPage = new DemoPage(page);
    await testPage.insertItemsInTodoList(todoList);
    
    const taskCounter = await testPage.todoItemList.count();
    const itemsleft = parseInt((await testPage.nrOfItemsInTodoList.textContent()),10);
    
    expect(itemsleft).toBe(taskCounter);
  });
  
  test('check that active section shows correct tasks', async ({page}) => {
    let testPage = new DemoPage(page);
  
    await testPage.insertItemsInTodoList(todoList);
    const allTasksCounter = await testPage.todoItemList.count();
    await testPage.checkBoxItem.check();
    await testPage.activeButton.click();
    const activeTaskCounter = await testPage.todoItemList.count();
    expect(activeTaskCounter).toBeLessThan(allTasksCounter);
  })
  
  test('check that completed section shows correct number of tasks', async ({page}) => {
    let testPage = new DemoPage(page);
  
    await testPage.insertItemsInTodoList(todoList);
    await testPage.checkBoxItem.check();
    await testPage.completedButton.click();
    const completedTaskCounter = await testPage.todoItemList.count();
    expect(completedTaskCounter).toBe(1);
  })
  
  test('check that completed item can be removed from todoList', async ({page}) => {
    let testPage = new DemoPage(page);
  
    await testPage.insertItemsInTodoList(todoList);
    const tasksBefore = await testPage.todoItemList.count();
    await testPage.checkBoxItem.check();
    await testPage.clearCompletedButton.click();
    const tasksAfter = await testPage.todoItemList.count();
    expect(tasksAfter).toBeLessThan(tasksBefore);
  })
})

test.describe('editability', () => {
  test('check that task is editable', async({page}) => {
    let testPage = new DemoPage(page);
  
    const task = testPage.todoEditItem.nth(0);
    await testPage.enterFirstElementEditMode(todoList);
    await expect(task.getByRole('textbox', { name: 'Edit' })).toHaveValue('buy coffee');
    
    await testPage.editTask('testing ..i. out of it','Enter');
    await expect(testPage.todoItemList.nth(0)).toHaveText('testing ..i. out of it');
  })
  
  test('check that removing text from a task also remove task itself', async({page}) => {
    let testPage = new DemoPage(page);
  
    await testPage.enterFirstElementEditMode(todoList);
    const taskBefore = await testPage.todoItemList.count();
    await testPage.editTask('','Enter'); 
    const taskAfter = await testPage.todoItemList.count();
    expect(taskAfter).toBeLessThan(taskBefore);
  })

  test('check that pressing esc quits editing mode', async({page}) => {
    let testPage = new DemoPage(page);

    await testPage.enterFirstElementEditMode(todoList);
    await expect(testPage.todoEditItem.first()).toHaveClass(/editing/);
    await testPage.editTask('testing ..i. out of it','Escape');
    await expect(testPage.todoEditItem.first()).not.toHaveClass(/editing/);
  })
})